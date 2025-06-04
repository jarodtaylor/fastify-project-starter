import { existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { copyTemplate } from "./utils/copy-template.js";
import { replaceTemplateVars } from "./utils/replace-vars.js";
import { promptForOptions } from "./utils/prompts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ProjectOptions {
  install: boolean;
  git: boolean;
  orm: "prisma" | "none";
  db: "sqlite" | "postgres" | "mysql";
  lint: "biome" | "eslint";
}

export async function createProject(
  projectName: string,
  cliOptions: Partial<ProjectOptions>
) {
  const projectPath = resolve(process.cwd(), projectName);

  // Check if directory exists
  if (existsSync(projectPath)) {
    throw new Error(`Directory "${projectName}" already exists`);
  }

  // Prompt for missing options
  const options = await promptForOptions(cliOptions);

  // Create project directory
  const spinner = ora("Creating project directory...").start();
  mkdirSync(projectPath, { recursive: true });
  spinner.succeed("Created project directory");

  // Copy template files
  spinner.start("Copying template files...");
  const templatePath = resolve(__dirname, "../..");
  await copyTemplate(templatePath, projectPath, options);
  spinner.succeed("Copied template files");

  // Replace template variables
  spinner.start("Customizing template...");
  await replaceTemplateVars(projectPath, projectName, options);
  spinner.succeed("Customized template");

  // Install dependencies
  if (options.install) {
    spinner.start("Installing dependencies...");
    try {
      await execa("pnpm", ["install"], { cwd: projectPath });
      spinner.succeed("Installed dependencies");
    } catch (error) {
      spinner.warn("Failed to install dependencies");
      console.log(
        chalk.yellow("You can install them manually with: pnpm install")
      );
    }
  }

  // Initialize database
  if (options.orm === "prisma") {
    spinner.start("Setting up database...");
    try {
      // Copy .env file
      await execa("cp", [".env.example", ".env"], { cwd: projectPath });

      // Generate Prisma client
      await execa(
        "npx",
        [
          "prisma",
          "generate",
          "--schema=packages/database/prisma/schema.prisma",
        ],
        {
          cwd: projectPath,
          env: { DATABASE_URL: "file:./data/dev.db" },
        }
      );

      // Push database schema
      await execa(
        "npx",
        [
          "prisma",
          "db",
          "push",
          "--schema=packages/database/prisma/schema.prisma",
        ],
        {
          cwd: projectPath,
          env: { DATABASE_URL: "file:./data/dev.db" },
        }
      );

      spinner.succeed("Set up database");
    } catch (error) {
      spinner.warn("Failed to set up database");
      console.log(
        chalk.yellow(
          "You can set it up manually with the instructions in the README"
        )
      );
    }
  }

  // Initialize git
  if (options.git) {
    spinner.start("Initializing git repository...");
    try {
      await execa("git", ["init"], { cwd: projectPath });
      await execa("git", ["add", "."], { cwd: projectPath });
      await execa("git", ["commit", "-m", "Initial commit"], {
        cwd: projectPath,
      });
      spinner.succeed("Initialized git repository");
    } catch (error) {
      spinner.warn("Failed to initialize git repository");
    }
  }
}
