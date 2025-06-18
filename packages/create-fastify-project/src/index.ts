#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Command, Option } from "commander";
import { createProject } from "./create-project";
import { logger } from "./helpers/logger";
import { runInteractiveMode } from "./helpers/prompts";
import { validateProjectName } from "./helpers/validation";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8"),
);

// Create the main program
const program = new Command();

// Configure program with enhanced styling
program
  .name("create-fastify-project")
  .description("Create a new Fastify + React Router 7 monorepo project")
  .version(packageJson.version, "-v, --version", "Display version number")
  .helpOption("-h, --help", "Display help for command")
  .argument("[project-name]", "Name of the project to create")
  .addOption(
    new Option("--no-install", "Skip dependency installation").default(true),
  )
  .addOption(new Option("--no-git", "Skip git initialization").default(true))
  .addOption(
    new Option("--orm <orm>", "ORM to use")
      .choices(["prisma", "none"])
      .default("prisma"),
  )
  .addOption(
    new Option("--db <database>", "Database to use")
      .choices(["sqlite", "postgres", "mysql"])
      .default("sqlite"),
  )
  .addOption(
    new Option("--lint <linter>", "Linter to use")
      .choices(["biome", "eslint"])
      .default("biome"),
  )
  .action(async (projectName, options) => {
    try {
      // Check if we should run in interactive mode
      if (!projectName) {
        // Full interactive mode - prompt for project name and all options
        logger.title("🚀 Create Fastify Project");
        logger.dim(
          "A modern monorepo template with Fastify API + React Router 7 frontend",
        );
        logger.break();

        const interactiveResult = await runInteractiveMode();

        // Create the project with interactive results
        await createProject(interactiveResult.projectName, {
          db: interactiveResult.db,
          orm: interactiveResult.orm,
          lint: interactiveResult.lint,
          git: interactiveResult.git,
          install: interactiveResult.install,
        });
      } else {
        // Traditional CLI mode with optional interactive prompts for missing options
        logger.title("🚀 Create Fastify Project");
        logger.dim(
          "A modern monorepo template with Fastify API + React Router 7 frontend",
        );
        logger.break();

        // Validate project name
        const validatedName = await validateProjectName(projectName);

        // Create the project (will prompt for missing options interactively)
        await createProject(validatedName, options);
      }

      // Success/error messaging is now handled in createProject
    } catch (error) {
      logger.error(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      process.exit(1);
    }
  });

// Enhanced error handling for invalid options/arguments
program.exitOverride((err) => {
  if (err.code === "commander.helpDisplayed") {
    // Help was displayed, exit cleanly
    process.exit(0);
  } else if (err.code === "commander.version") {
    // Version was displayed, exit cleanly
    process.exit(0);
  } else if (err.code === "commander.invalidArgument") {
    logger.error(`Invalid argument: ${err.message}`);
    logger.dim(
      "Run 'npx create-fastify-project@latest --help' for usage information",
    );
    process.exit(1);
  } else if (
    err.code === "commander.invalidOption" ||
    err.code === "commander.unknownOption"
  ) {
    logger.error(`Invalid option: ${err.message}`);
    logger.dim(
      "Run 'npx create-fastify-project@latest --help' for usage information",
    );
    process.exit(1);
  } else {
    // Re-throw other errors
    throw err;
  }
});

// Configure output for custom error formatting
program.configureOutput({
  outputError: (str, write) => {
    // Use our logger for Commander's error messages
    const cleanMessage = str.replace(/^error: /, "");
    logger.error(cleanMessage);
  },
});

// Parse arguments
program.parse();
