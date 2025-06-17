#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { Command } from "commander";
import { createProject } from "./create-project.js";
import { validateProjectName } from "./utils/validation.js";
import { runInteractiveMode, promptForProjectName } from "./utils/prompts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf-8")
);
const version = packageJson.version;

const program = new Command();

program
  .name("create-fastify-project")
  .description("Create a new Fastify + React Router 7 monorepo project")
  .version(version)
  .argument("[project-name]", "Name of the project to create")
  .option("--no-install", "Skip dependency installation")
  .option("--no-git", "Skip git initialization")
  .option("--orm <orm>", "ORM to use (prisma, none)", "prisma")
  .option(
    "--db <database>",
    "Database to use (sqlite, postgres, mysql)",
    "sqlite"
  )
  .option("--lint <linter>", "Linter to use (biome, eslint)", "biome")
  .action(async (projectName, options) => {
    try {
      // Check if we should run in interactive mode
      if (!projectName) {
        // Full interactive mode - prompt for project name and all options
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
        console.log(chalk.blue.bold("🚀 Create Fastify Project"));
        console.log(
          chalk.gray(
            "A modern monorepo template with Fastify API + React Router 7 frontend\n"
          )
        );

        // Validate project name
        const validatedName = await validateProjectName(projectName);

        // Create the project (will prompt for missing options interactively)
        await createProject(validatedName, options);
      }

      // Success/error messaging is now handled in createProject
    } catch (error) {
      console.error(
        chalk.red.bold("❌ Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program.parse();
