import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import type { ExecaError } from "execa";

export interface ErrorContext {
  operation: string;
  projectPath?: string;
  command?: string;
  details?: string;
}

export interface RecoveryInstructions {
  message: string;
  steps: string[];
  helpUrl?: string;
}

/**
 * Enhanced error handler with contextual recovery instructions
 */
export class EnhancedError extends Error {
  public readonly context: ErrorContext;
  public readonly recovery: RecoveryInstructions;
  public readonly originalError?: Error;

  constructor(
    message: string,
    context: ErrorContext,
    recovery: RecoveryInstructions,
    originalError?: Error
  ) {
    super(message);
    this.name = "EnhancedError";
    this.context = context;
    this.recovery = recovery;
    this.originalError = originalError;
  }

  public display(): void {
    console.error(chalk.red.bold(`❌ ${this.context.operation} failed:`));
    console.error(chalk.red(`   ${this.message}`));

    if (this.context.details) {
      console.error(chalk.gray(`   Details: ${this.context.details}`));
    }

    console.log(chalk.yellow(`\n🔧 ${this.recovery.message}`));
    this.recovery.steps.forEach((step, index) => {
      console.log(chalk.cyan(`   ${index + 1}. ${step}`));
    });

    if (this.recovery.helpUrl) {
      console.log(chalk.dim(`\n💡 More help: ${this.recovery.helpUrl}`));
    }
  }
}

/**
 * Check file system permissions and space
 */
export async function checkFileSystemHealth(targetPath: string): Promise<{
  canWrite: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  let canWrite = true;

  try {
    // Check if parent directory exists and is writable
    const parentDir = resolve(targetPath, "..");
    await access(parentDir, constants.F_OK | constants.W_OK);
  } catch {
    canWrite = false;
    issues.push("Parent directory is not writable");
  }

  // Basic disk space check (heuristic)
  if (process.platform !== "win32") {
    try {
      const { execSync } = await import("node:child_process");
      const output = execSync(`df -h "${resolve(targetPath, "..")}"`, {
        encoding: "utf8",
        timeout: 5000,
      });
      const lines = output.split("\n");
      if (lines.length > 1) {
        const usage = lines[1].split(/\s+/)[4];
        if (usage && Number.parseInt(usage) > 95) {
          issues.push("Disk space is critically low (>95% used)");
        }
      }
    } catch {
      // Ignore disk space check failure - it's not critical
    }
  }

  return { canWrite, issues };
}

/**
 * Handle network-related errors with appropriate recovery instructions
 */
export function handleNetworkError(
  error: ExecaError,
  context: ErrorContext
): EnhancedError {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("enotfound") || errorMessage.includes("network")) {
    return new EnhancedError(
      "Network connection failed",
      {
        ...context,
        details: "Unable to reach npm registry or git repository",
      },
      {
        message: "Network connectivity issues detected",
        steps: [
          "Check your internet connection",
          "Try again in a few moments",
          "If using a corporate network, check proxy settings",
          "Consider using: pnpm config set registry https://registry.npmmirror.com",
          "Or create project with --no-install and install dependencies manually later",
        ],
        helpUrl: "https://docs.npmjs.com/troubleshooting/network-issues",
      },
      error
    );
  }

  if (errorMessage.includes("timeout") || errorMessage.includes("etimedout")) {
    return new EnhancedError(
      "Operation timed out",
      {
        ...context,
        details: "Network request took too long to complete",
      },
      {
        message: "Network timeout occurred",
        steps: [
          "Try the operation again (it might be temporary)",
          "Check if you're behind a firewall or proxy",
          "Increase timeout with: pnpm config set network-timeout 300000",
          "Consider using a different npm registry if issues persist",
        ],
      },
      error
    );
  }

  if (errorMessage.includes("proxy") || errorMessage.includes("407")) {
    return new EnhancedError(
      "Proxy authentication failed",
      {
        ...context,
        details: "Unable to authenticate with corporate proxy",
      },
      {
        message: "Corporate proxy configuration needed",
        steps: [
          "Contact your IT department for proxy settings",
          "Set proxy with: pnpm config set proxy http://proxy.company.com:8080",
          "Set https-proxy with: pnpm config set https-proxy http://proxy.company.com:8080",
          "Or create project with --no-install flag and configure proxy later",
        ],
      },
      error
    );
  }

  // Generic network error
  return new EnhancedError(
    "Network operation failed",
    {
      ...context,
      details: error.message,
    },
    {
      message: "Network issues detected",
      steps: [
        "Check your internet connection",
        "Try again in a few moments",
        "If problem persists, create project with --no-install",
        "Then run 'pnpm install' manually once network is stable",
      ],
    },
    error
  );
}

/**
 * Handle file system related errors
 */
export function handleFileSystemError(
  error: Error,
  context: ErrorContext
): EnhancedError {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("enospc") || errorMessage.includes("no space")) {
    return new EnhancedError(
      "Insufficient disk space",
      {
        ...context,
        details: "Not enough free disk space to complete operation",
      },
      {
        message: "Disk space is full",
        steps: [
          "Free up disk space by deleting unnecessary files",
          "Check available space with: df -h (Linux/Mac) or dir (Windows)",
          "Try creating project in a different location with more space",
          "Clear npm cache with: pnpm store prune",
        ],
      },
      error
    );
  }

  if (errorMessage.includes("eacces") || errorMessage.includes("permission")) {
    return new EnhancedError(
      "Permission denied",
      {
        ...context,
        details: "Insufficient permissions to write to target directory",
      },
      {
        message: "File system permissions issue",
        steps: [
          "Check if you have write permissions to the target directory",
          "Try running from a different directory where you have write access",
          "On Unix systems, check permissions with: ls -la",
          "Avoid using sudo with npm/pnpm - instead fix npm permissions",
        ],
        helpUrl:
          "https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally",
      },
      error
    );
  }

  if (errorMessage.includes("eexist")) {
    return new EnhancedError(
      "File or directory already exists",
      {
        ...context,
        details: "Cannot create project - target already exists",
      },
      {
        message: "Target directory conflicts",
        steps: [
          "Choose a different project name",
          "Remove the existing directory if it's not needed",
          "Move the existing directory to a backup location",
          "Use a subdirectory: mkdir my-projects && cd my-projects",
        ],
      },
      error
    );
  }

  // Generic file system error
  return new EnhancedError(
    "File system operation failed",
    {
      ...context,
      details: error.message,
    },
    {
      message: "File system error occurred",
      steps: [
        "Check if you have sufficient permissions",
        "Ensure adequate disk space is available",
        "Try creating the project in a different location",
        "If issue persists, check system logs for more details",
      ],
    },
    error
  );
}

/**
 * Handle git-related errors
 */
export function handleGitError(
  error: ExecaError,
  context: ErrorContext
): EnhancedError {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("not found") ||
    errorMessage.includes("command not found")
  ) {
    return new EnhancedError(
      "Git not installed",
      {
        ...context,
        details: "Git is required but not found on your system",
      },
      {
        message: "Git installation required",
        steps: [
          "Install Git from: https://git-scm.com/downloads",
          "After installation, restart your terminal",
          "Verify installation with: git --version",
          "Or skip git initialization with --no-git flag",
        ],
        helpUrl:
          "https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",
      },
      error
    );
  }

  if (errorMessage.includes("not a git repository")) {
    return new EnhancedError(
      "Git repository initialization failed",
      {
        ...context,
        details: "Unable to initialize git repository in project directory",
      },
      {
        message: "Git initialization issue",
        steps: [
          "The project was created successfully but git init failed",
          "You can initialize git manually with: git init",
          "Then add files with: git add .",
          "And create initial commit with: git commit -m 'Initial commit'",
        ],
      },
      error
    );
  }

  // Generic git error
  return new EnhancedError(
    "Git operation failed",
    {
      ...context,
      details: error.message,
    },
    {
      message: "Git error occurred",
      steps: [
        "Check if git is properly installed: git --version",
        "Ensure you're in a directory where you have write permissions",
        "Try initializing git manually after project creation",
        "Or skip git initialization with --no-git flag",
      ],
    },
    error
  );
}

/**
 * Handle PNPM/npm specific errors
 */
export function handlePackageManagerError(
  error: ExecaError,
  context: ErrorContext
): EnhancedError {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("pnpm: command not found") ||
    errorMessage.includes("'pnpm' is not recognized")
  ) {
    return new EnhancedError(
      "PNPM not installed",
      {
        ...context,
        details: "PNPM package manager is required but not found",
      },
      {
        message: "PNPM installation required",
        steps: [
          "Install PNPM with: npm install -g pnpm",
          "Or using Corepack: corepack enable",
          "Verify installation with: pnpm --version",
          "Restart your terminal and try again",
        ],
        helpUrl: "https://pnpm.io/installation",
      },
      error
    );
  }

  if (
    errorMessage.includes("peer dep") ||
    errorMessage.includes("peer dependency")
  ) {
    return new EnhancedError(
      "Peer dependency conflicts",
      {
        ...context,
        details: "Package dependency conflicts detected",
      },
      {
        message: "Dependency resolution issues",
        steps: [
          "This usually resolves automatically - the project should still work",
          "If issues persist, try: pnpm install --force",
          "Or clear cache and retry: pnpm store prune && pnpm install",
          "Check for version conflicts in package.json files",
        ],
      },
      error
    );
  }

  // Check for network-related package manager errors
  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return handleNetworkError(error, context);
  }

  // Generic package manager error
  return new EnhancedError(
    "Package installation failed",
    {
      ...context,
      details: error.message,
    },
    {
      message: "Package manager error occurred",
      steps: [
        "Try clearing package manager cache: pnpm store prune",
        "Delete node_modules and try again: rm -rf node_modules && pnpm install",
        "Check if you have sufficient disk space",
        "Try with --no-install flag and install dependencies manually",
      ],
    },
    error
  );
}
