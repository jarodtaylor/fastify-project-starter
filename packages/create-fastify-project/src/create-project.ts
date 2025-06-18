import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type ExecaError, execa } from "execa";
import {
  EnhancedError,
  checkFileSystemHealth,
  handleFileSystemError,
  handleGitError,
  handlePackageManagerError,
} from "./helpers/error-handling";
import { logger } from "./helpers/logger";
import { promptForOptions } from "./helpers/prompts";
import {
  checkNetworkEnvironment,
  validateProjectOptions,
} from "./helpers/validation";
import { setupDatabase, setupExternalDatabase } from "./workflows/database";
import { initializeGit } from "./workflows/git";
import { installDependencies } from "./workflows/install";
import {
  copyTemplateFiles,
  customizeTemplate,
  updateVersions,
} from "./workflows/templates";
import {
  displayManualSetupInstructions,
  displaySuccessMessage,
  performPreFlightChecks,
  validateProject,
} from "./workflows/validation";

const __dirname = dirname(fileURLToPath(import.meta.url));

import type { ProjectOptions } from "./types";

export async function createProject(
  projectName: string,
  cliOptions: Partial<ProjectOptions>,
) {
  const startTime = Date.now();
  const projectPath = resolve(process.cwd(), projectName);

  // Show welcome message
  logger.title(`Creating ${projectName}`);

  // Enhanced pre-flight checks
  await performPreFlightChecks(projectPath, cliOptions);

  // Prompt for missing options
  const options = await promptForOptions(cliOptions);

  // Show project configuration
  const config = {
    Project: projectName,
    Database: options.db.toUpperCase(),
    ORM: options.orm === "prisma" ? "Prisma" : "None",
    Linter: options.lint === "biome" ? "Biome" : "ESLint",
    Git: options.git ? "Yes" : "No",
    Install: options.install ? "Yes" : "No",
  };
  logger.summary(projectName, config);

  // Create project directory with enhanced error handling
  const spinner = logger.spinner("Creating project directory...");
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
    logger.warn(
      "Skipping database setup because dependencies installation failed",
    );
  }

  // Initialize git with enhanced error handling
  if (options.git) {
    await initializeGit(projectPath, spinner);
  }

  // Validate project setup
  const validationSpinner = logger.spinner("Validating project setup...");
  const hasErrors = await validateProject(projectPath, options);

  if (hasErrors) {
    validationSpinner.fail("Project created with issues");
    displayManualSetupInstructions(projectName, options);
  } else {
    validationSpinner.succeed("Project validated successfully");

    // Calculate completion time
    const completionTime = Date.now() - startTime;

    // Show completion message
    logger.completion(projectName, completionTime);

    // Show what was included
    const includedFeatures = [
      "Fastify API server (apps/api)",
      "React Router 7 web app (apps/web)",
      "Shared TypeScript config & utilities",
    ];

    if (options.orm === "prisma") {
      includedFeatures.push(
        `Prisma ORM with ${options.db.toUpperCase()} database`,
      );
    }

    includedFeatures.push(
      `${options.lint === "biome" ? "Biome" : "ESLint"} for code quality`,
    );

    logger.box("What's included", includedFeatures);

    // Show next steps
    const steps = [
      {
        title: "Navigate to your project",
        command: `cd ${projectName}`,
      },
      {
        title: "Start development servers",
        command: "pnpm dev",
        description:
          "This will start both API (port 3001) and web (port 3000) servers",
      },
    ];

    // Add conditional steps
    if (!options.install) {
      steps.splice(1, 0, {
        title: "Install dependencies",
        command: "pnpm install",
      });
    }

    if (options.orm === "prisma" && options.db !== "sqlite") {
      steps.splice(-1, 0, {
        title: "Configure your database",
        command: "# Edit .env file",
        description: `Update DATABASE_URL in .env for ${options.db.toUpperCase()}`,
      });
    }

    logger.nextSteps(projectName, steps);

    // Show useful commands
    logger.section("Useful commands:");
    logger.command("pnpm dev          # Start both API and web in development");
    logger.command("pnpm build        # Build for production");
    logger.command("pnpm lint         # Run linter");
    logger.command("pnpm format       # Format code");

    if (options.orm === "prisma") {
      logger.command("pnpm db:studio    # Open Prisma Studio");
    }

    logger.break();
    logger.dim("💡 Check the README.md for more detailed instructions");
    logger.success("Happy coding! 🚀");
  }
}
