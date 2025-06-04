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
  const templatePath = resolve(__dirname, "../template");
  await copyTemplate(templatePath, projectPath, options);
  spinner.succeed("Copied template files");

  // Replace template variables
  spinner.start("Customizing template...");
  await replaceTemplateVars(projectPath, projectName, options);
  spinner.succeed("Customized template");

  // Install dependencies
  let dependenciesInstalled = false;
  if (options.install) {
    spinner.start("Installing dependencies...");
    try {
      await execa("pnpm", ["install"], { cwd: projectPath });
      dependenciesInstalled = true;
      spinner.succeed("Installed dependencies");

      // Format generated code after dependencies are installed
      spinner.start("Formatting generated code...");
      try {
        await execa("pnpm", ["format"], { cwd: projectPath });
        spinner.succeed("Formatted generated code");
      } catch (error) {
        spinner.warn("Could not format generated code");
      }
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.log(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      console.log(
        chalk.yellow(
          "You must install dependencies manually with: pnpm install"
        )
      );
    }
  }

  // Initialize database (only if dependencies are installed)
  if (options.orm === "prisma" && dependenciesInstalled) {
    spinner.start("Setting up database...");
    try {
      // Copy .env files to both root and database package
      await execa("cp", [".env.example", ".env"], { cwd: projectPath });
      await execa(
        "cp",
        ["packages/database/.env.example", "packages/database/.env"],
        { cwd: projectPath }
      );

      // Generate Prisma client (run from database package directory)
      await execa("pnpm", ["prisma", "generate"], {
        cwd: resolve(projectPath, "packages/database"),
      });

      // Push database schema (run from database package directory)
      await execa("pnpm", ["prisma", "db", "push"], {
        cwd: resolve(projectPath, "packages/database"),
      });

      spinner.succeed("Set up database");
    } catch (error) {
      spinner.fail("Failed to set up database");
      console.log(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : String(error)}`
        )
      );
      console.log(
        chalk.yellow(
          "You can set it up manually with the instructions in the README"
        )
      );
    }
  } else if (options.orm === "prisma" && !dependenciesInstalled) {
    console.log(
      chalk.yellow(
        "⚠️  Skipping database setup because dependencies installation failed"
      )
    );
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

  // Validate project setup
  spinner.start("Validating project setup...");
  const hasErrors = await validateProject(projectPath, options);

  if (hasErrors) {
    spinner.fail("Project created with issues");
    console.log(chalk.red("\n⚠️  Project created but requires manual setup:"));

    if (!options.install) {
      console.log(chalk.yellow("\n📦 Install dependencies:"));
      console.log(chalk.cyan(`   cd ${projectName}`));
      console.log(chalk.cyan("   pnpm install"));
    }

    if (options.orm === "prisma") {
      console.log(chalk.yellow("\n🗄️  Set up database:"));
      console.log(chalk.cyan("   cp .env.example .env"));
      console.log(
        chalk.cyan(
          "   cp packages/database/.env.example packages/database/.env"
        )
      );
      console.log(
        chalk.cyan("   cd packages/database && pnpm prisma generate")
      );
      console.log(chalk.cyan("   cd packages/database && pnpm prisma db push"));
    }

    console.log(chalk.yellow("\n🚀 Start development:"));
    console.log(chalk.cyan("   pnpm dev"));

    console.log(
      chalk.dim("\n💡 Need help? Check the README.md or report issues at:")
    );
    console.log(
      chalk.dim(
        "   https://github.com/jarodtaylor/fastify-react-router-starter/issues"
      )
    );

    console.log(
      chalk.red(
        "\n❌ Setup incomplete - follow the steps above before running pnpm dev"
      )
    );
  } else {
    spinner.succeed("Project validated successfully");
    console.log(chalk.green("\n✨ Project created successfully!"));
    console.log(chalk.yellow("\nNext steps:"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  pnpm dev"));
    console.log(chalk.green("\nHappy coding! 🎉"));
  }
}

async function validateProject(
  projectPath: string,
  options: ProjectOptions
): Promise<boolean> {
  let hasErrors = false;

  // Check if dependencies are installed by looking for node_modules
  if (!existsSync(resolve(projectPath, "node_modules"))) {
    hasErrors = true;
  }

  // Check if required packages exist
  const requiredPackages = [
    "packages/shared-utils",
    "packages/typescript-config",
  ];
  if (options.orm === "prisma") {
    requiredPackages.push("packages/database");
  }

  for (const pkg of requiredPackages) {
    if (!existsSync(resolve(projectPath, pkg))) {
      hasErrors = true;
      break;
    }
  }

  return hasErrors;
}
