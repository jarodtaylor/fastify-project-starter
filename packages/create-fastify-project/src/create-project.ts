import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { type ExecaError, execa } from "execa";
import ora, { type Ora } from "ora";
import { promptForOptions } from "./helpers/prompts.js";
import {
  validateProjectOptions,
  checkNetworkEnvironment,
} from "./helpers/validation.js";
import {
  checkFileSystemHealth,
  EnhancedError,
  handleFileSystemError,
  handlePackageManagerError,
  handleGitError,
} from "./helpers/error-handling.js";
import {
  copyTemplateFiles,
  customizeTemplate,
  updateVersions,
} from "./workflows/templates.js";
import { installDependencies } from "./workflows/install.js";
import { setupDatabase, setupExternalDatabase } from "./workflows/database.js";
import { initializeGit } from "./workflows/git.js";
import {
  performPreFlightChecks,
  validateProject,
  displayManualSetupInstructions,
  displaySuccessMessage,
} from "./workflows/validation.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

import type { ProjectOptions } from "./types.js";

export async function createProject(
  projectName: string,
  cliOptions: Partial<ProjectOptions>
) {
  const projectPath = resolve(process.cwd(), projectName);

  // Enhanced pre-flight checks
  await performPreFlightChecks(projectPath, cliOptions);

  // Prompt for missing options
  const options = await promptForOptions(cliOptions);

  // Create project directory with enhanced error handling
  const spinner = ora("Creating project directory...").start();
  try {
    mkdirSync(projectPath, { recursive: true });
    spinner.succeed("Created project directory");
  } catch (error) {
    spinner.fail("Failed to create project directory");
    const enhancedError = handleFileSystemError(error as Error, {
      operation: "Directory creation",
      projectPath,
      details: "Unable to create project directory",
    });
    enhancedError.display();
    process.exit(1);
  }

  // Copy and customize template files
  const templatePath = resolve(__dirname, "../template");
  await copyTemplateFiles(templatePath, projectPath, options, spinner);
  await customizeTemplate(projectPath, projectName, options, spinner);

  // Update dependencies to latest versions
  await updateVersions(projectPath, spinner);

  // Install dependencies with enhanced error handling
  let dependenciesInstalled = false;
  if (options.install) {
    dependenciesInstalled = await installDependencies(projectPath, spinner);
  }

  // Initialize database (only for SQLite when dependencies are installed)
  if (options.orm === "prisma" && dependenciesInstalled) {
    if (options.db === "sqlite") {
      await setupDatabase(projectPath, spinner, options);
    } else {
      // For PostgreSQL/MySQL, only do basic setup without connecting
      await setupExternalDatabase(projectPath, spinner, options);
    }
  } else if (options.orm === "prisma" && !dependenciesInstalled) {
    console.log(
      chalk.yellow(
        "⚠️  Skipping database setup because dependencies installation failed"
      )
    );
  }

  // Initialize git with enhanced error handling
  if (options.git) {
    await initializeGit(projectPath, spinner);
  }

  // Validate project setup
  spinner.start("Validating project setup...");
  const hasErrors = await validateProject(projectPath, options);

  if (hasErrors) {
    spinner.fail("Project created with issues");
    displayManualSetupInstructions(projectName, options);
  } else {
    spinner.succeed("Project validated successfully");
    displaySuccessMessage(projectName, options);
  }
}
