import { access, constants } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import chalk from "chalk";
import { logger } from "../helpers/logger";
import {
  checkFileSystemHealth,
  EnhancedError,
} from "../helpers/error-handling";
import {
  validateProjectOptions,
  checkNetworkEnvironment,
} from "../helpers/validation";
import type { ProjectOptions } from "../types";

/**
 * Perform pre-flight checks before project creation
 */
export async function performPreFlightChecks(
  projectPath: string,
  cliOptions: Partial<ProjectOptions>
): Promise<void> {
  // Check if directory exists
  if (existsSync(projectPath)) {
    throw new Error(`Directory "${projectPath}" already exists`);
  }

  // Validate CLI options early
  validateProjectOptions(cliOptions);

  // Check file system health
  const { canWrite, issues } = await checkFileSystemHealth(projectPath);
  if (!canWrite) {
    const error = new EnhancedError(
      "Cannot write to target directory",
      {
        operation: "Pre-flight check",
        projectPath,
        details: issues.join("; "),
      },
      {
        message: "File system permission issues detected",
        steps: [
          "Check if you have write permissions to the current directory",
          "Try running from a directory where you have write access",
          "On Unix systems, check permissions with: ls -la",
          "Ensure sufficient disk space is available",
        ],
      }
    );
    error.display();
    process.exit(1);
  }

  if (issues.length > 0) {
    logger.warn("Warnings detected:");
    for (const issue of issues) {
      logger.listItem(issue);
    }
    logger.break();
  }

  // Check network environment
  const { warnings } = checkNetworkEnvironment();
  if (warnings.length > 0) {
    logger.info("Environment notes:");
    for (const warning of warnings) {
      logger.listItem(warning);
    }
    logger.break();
  }
}

/**
 * Validate project setup after creation
 */
export async function validateProject(
  projectPath: string,
  options: ProjectOptions
): Promise<boolean> {
  let hasErrors = false;

  // Check if essential files exist
  const essentialFiles = [
    "package.json",
    "apps/api/package.json",
    "apps/web/package.json",
  ];

  for (const file of essentialFiles) {
    const filePath = resolve(projectPath, file);
    try {
      await access(filePath, constants.F_OK);
    } catch {
      logger.error(`Missing essential file: ${file}`);
      hasErrors = true;
    }
  }

  // Check database files if Prisma is enabled
  if (options.orm === "prisma") {
    const prismaFiles = [
      "packages/database/package.json",
      "packages/database/prisma/schema.prisma",
    ];

    for (const file of prismaFiles) {
      const filePath = resolve(projectPath, file);
      try {
        await access(filePath, constants.F_OK);
      } catch {
        logger.error(`Missing Prisma file: ${file}`);
        hasErrors = true;
      }
    }
  }

  return hasErrors;
}

/**
 * Display manual setup instructions when automated setup fails
 */
export function displayManualSetupInstructions(
  projectName: string,
  options: ProjectOptions
): void {
  logger.warn("Manual setup required");

  const steps: Array<{
    title: string;
    command?: string;
    description?: string;
  }> = [
    {
      title: "Navigate to your project",
      command: `cd ${projectName}`,
    },
  ];

  if (!options.install) {
    steps.push({
      title: "Install dependencies",
      command: "pnpm install",
    });
  }

  if (options.orm === "prisma") {
    steps.push({
      title: "Set up environment",
      command: "cp .env.example .env",
    });

    if (options.db !== "sqlite") {
      steps.push({
        title: "Configure database",
        command: "# Edit .env file",
        description: `Update DATABASE_URL in .env for ${options.db.toUpperCase()}`,
      });
    }

    steps.push(
      {
        title: "Generate Prisma client",
        command: "cd packages/database && pnpm prisma generate",
      },
      {
        title: "Push database schema",
        command: "pnpm prisma db push",
      },
      {
        title: "Return to project root",
        command: "cd ../..",
      }
    );
  }

  if (!options.git) {
    steps.push(
      {
        title: "Initialize git (optional)",
        command: "git init",
      },
      {
        title: "Make initial commit",
        command: "git add . && git commit -m 'Initial commit'",
      }
    );
  }

  steps.push({
    title: "Start development",
    command: "pnpm dev",
  });

  logger.nextSteps(projectName, steps);
  logger.dim("💡 Check the README.md for more detailed instructions");
}

/**
 * Display success message when project is created successfully
 * @deprecated Use the enhanced logger system in create-project.ts instead
 */
export function displaySuccessMessage(
  projectName: string,
  options: ProjectOptions
): void {
  // This function is deprecated in favor of the enhanced logger system
  // in create-project.ts, but keeping for backwards compatibility
  console.log(chalk.green("\n🎉 Project created successfully!"));
  console.log(chalk.cyan("\n📁 Navigate to your project:"));
  console.log(chalk.cyan(`   cd ${projectName}`));
  console.log(chalk.cyan("\n🚀 Start development:"));
  console.log(chalk.cyan("   pnpm dev"));

  console.log(chalk.dim("\n📚 What's included:"));
  console.log(chalk.dim("   • Fastify API server (apps/api)"));
  console.log(chalk.dim("   • React Router 7 web app (apps/web)"));
  console.log(chalk.dim("   • Shared TypeScript config & utilities"));
  if (options.orm === "prisma") {
    console.log(
      chalk.dim(`   • Prisma ORM with ${options.db.toUpperCase()} database`)
    );
  }
  console.log(
    chalk.dim(
      `   • ${options.lint === "biome" ? "Biome" : "ESLint"} for code quality`
    )
  );

  console.log(chalk.cyan("\n🔗 Useful commands:"));
  console.log(
    chalk.cyan("   pnpm dev          # Start both API and web in development")
  );
  console.log(chalk.cyan("   pnpm build        # Build for production"));
  console.log(chalk.cyan("   pnpm lint         # Run linter"));
  console.log(chalk.cyan("   pnpm format       # Format code"));
  if (options.orm === "prisma") {
    console.log(chalk.cyan("   pnpm db:studio    # Open Prisma Studio"));
  }

  console.log(
    chalk.dim("\n💡 Check the README.md for more detailed instructions")
  );
  console.log(chalk.green("\nHappy coding! 🚀"));
}
