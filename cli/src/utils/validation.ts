import { existsSync } from "node:fs";
import { resolve } from "node:path";
import inquirer from "inquirer";
import validateNpmPackageName from "validate-npm-package-name";
import type { ProjectOptions } from "../create-project.js";

// Constants for validation limits
const MAX_PATH_LENGTH = process.platform === "win32" ? 260 : 4096;
const MAX_PROJECT_NAME_LENGTH = 214; // npm package name limit

/**
 * Enhanced project name validation with better error handling
 */
export async function validateProjectName(
  providedName?: string
): Promise<string> {
  if (providedName) {
    const validationResult = validateProjectNameString(providedName);
    if (validationResult.isValid) {
      return providedName;
    }
    throw new Error(validationResult.error);
  }

  // Prompt for project name if not provided
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-fastify-react-app",
      validate: (input: string) => {
        const validation = validateProjectNameString(input);
        return validation.isValid ? true : validation.error;
      },
    },
  ]);

  return projectName;
}

/**
 * Comprehensive project name validation
 */
function validateProjectNameString(name: string): {
  isValid: boolean;
  error: string;
} {
  // Check for empty or whitespace-only names
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: "Project name cannot be empty",
    };
  }

  const trimmedName = name.trim();

  // Check length limits
  if (trimmedName.length > MAX_PROJECT_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Project name is too long (${trimmedName.length} characters). Maximum allowed is ${MAX_PROJECT_NAME_LENGTH} characters.`,
    };
  }

  // Check for problematic characters that might break file systems
  const problematicChars = /[<>:"|?*]/;
  if (problematicChars.test(trimmedName)) {
    return {
      isValid: false,
      error: 'Project name contains invalid characters. Avoid: < > : " | ? *',
    };
  }

  // Check for reserved Windows names
  const windowsReserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
  if (process.platform === "win32" && windowsReserved.test(trimmedName)) {
    return {
      isValid: false,
      error: `"${trimmedName}" is a reserved name on Windows. Please choose a different name.`,
    };
  }

  // Check npm package name validity
  const npmValidation = validateNpmPackageName(trimmedName);
  if (!npmValidation.validForNewPackages) {
    const errors = npmValidation.errors || [];
    const warnings = npmValidation.warnings || [];
    const issues = [...errors, ...warnings];

    return {
      isValid: false,
      error: `Invalid project name for npm: ${issues.join(
        ", "
      )}. Consider using lowercase letters, numbers, and dashes only.`,
    };
  }

  // Check if the resulting path would be too long
  const proposedPath = resolve(process.cwd(), trimmedName);
  if (proposedPath.length > MAX_PATH_LENGTH) {
    return {
      isValid: false,
      error: `The full path would be too long (${proposedPath.length} characters). Maximum allowed is ${MAX_PATH_LENGTH}. Try a shorter name or create the project in a directory with a shorter path.`,
    };
  }

  // Check if directory already exists
  if (existsSync(proposedPath)) {
    return {
      isValid: false,
      error: `Directory "${trimmedName}" already exists. Please choose a different name or remove the existing directory.`,
    };
  }

  return { isValid: true, error: "" };
}

export function validateProjectOptions(options: Partial<ProjectOptions>): void {
  const errors: string[] = [];

  // Validate database option
  if (options.db && !["sqlite", "postgres", "mysql"].includes(options.db)) {
    errors.push(
      `Invalid database option: "${options.db}". Must be one of: sqlite, postgres, mysql`
    );
  }

  // Validate ORM option
  if (options.orm && !["prisma", "none"].includes(options.orm)) {
    errors.push(
      `Invalid ORM option: "${options.orm}". Must be one of: prisma, none`
    );
  }

  // Validate linter option
  if (options.lint && !["biome", "eslint"].includes(options.lint)) {
    errors.push(
      `Invalid linter option: "${options.lint}". Must be one of: biome, eslint`
    );
  }

  // Validate boolean options
  if (options.install !== undefined && typeof options.install !== "boolean") {
    errors.push("Install option must be a boolean");
  }

  if (options.git !== undefined && typeof options.git !== "boolean") {
    errors.push("Git option must be a boolean");
  }

  // Throw all errors at once for better UX
  if (errors.length > 0) {
    throw new Error(
      `Validation errors:\n${errors.map((e) => `  • ${e}`).join("\n")}`
    );
  }

  // Validate logical combinations (warnings, not errors)
  if (options.orm === "none" && options.db && options.db !== "sqlite") {
    console.warn(
      "⚠️  Warning: Database option is ignored when ORM is set to 'none'"
    );
  }
}

/**
 * Check if we're in an environment where network operations might fail
 */
export function checkNetworkEnvironment(): {
  hasNetwork: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Check if we're likely offline (basic heuristic)
  const isOffline =
    process.env.NODE_ENV === "test" ||
    (process.env.CI === "true" && process.env.OFFLINE_MODE === "true");

  if (isOffline) {
    warnings.push("Detected offline environment - some operations may fail");
  }

  // Check for common CI environments where npm registry might be different
  if (process.env.CI === "true") {
    warnings.push("Running in CI environment - using CI-appropriate settings");
  }

  return {
    hasNetwork: !isOffline,
    warnings,
  };
}
