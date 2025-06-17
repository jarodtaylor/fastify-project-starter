import prompts from "prompts";
import chalk from "chalk";
import type { ProjectOptions } from "../create-project.js";

export interface InteractiveOptions extends ProjectOptions {
  projectName: string;
}

/**
 * Prompt for missing options interactively
 */
export async function promptForOptions(
  cliOptions: Partial<ProjectOptions>
): Promise<ProjectOptions> {
  // If all options are provided via CLI, skip interactive prompts
  const hasAllOptions =
    cliOptions.db !== undefined &&
    cliOptions.orm !== undefined &&
    cliOptions.lint !== undefined &&
    cliOptions.git !== undefined &&
    cliOptions.install !== undefined;

  if (hasAllOptions) {
    return {
      db: cliOptions.db as "sqlite" | "postgres" | "mysql",
      orm: cliOptions.orm as "prisma" | "none",
      lint: cliOptions.lint as "biome" | "eslint",
      git: cliOptions.git as boolean,
      install: cliOptions.install as boolean,
    };
  }

  console.log(chalk.gray("Let's set up your Fastify project...\n"));

  const questions: prompts.PromptObject[] = [];

  // Database selection
  if (cliOptions.db === undefined) {
    questions.push({
      type: "select",
      name: "db",
      message: "Which database would you like to use?",
      choices: [
        {
          title: "SQLite",
          description:
            "Lightweight, file-based database (great for development)",
          value: "sqlite",
        },
        {
          title: "PostgreSQL",
          description: "Powerful, production-ready relational database",
          value: "postgres",
        },
        {
          title: "MySQL",
          description: "Popular, widely-supported relational database",
          value: "mysql",
        },
      ],
      initial: 0,
    });
  }

  // ORM selection (only if database is selected)
  if (cliOptions.orm === undefined) {
    questions.push({
      type: "select",
      name: "orm",
      message: "Would you like to use an ORM?",
      choices: [
        {
          title: "Prisma",
          description: "Modern, type-safe ORM with great developer experience",
          value: "prisma",
        },
        {
          title: "None",
          description: "Use raw SQL queries (more control, less abstraction)",
          value: "none",
        },
      ],
      initial: 0,
    });
  }

  // Linting selection
  if (cliOptions.lint === undefined) {
    questions.push({
      type: "select",
      name: "lint",
      message: "Which linter would you prefer?",
      choices: [
        {
          title: "Biome",
          description: "Fast, modern linter and formatter (recommended)",
          value: "biome",
        },
        {
          title: "ESLint",
          description: "Popular, highly configurable JavaScript linter",
          value: "eslint",
        },
      ],
      initial: 0,
    });
  }

  // Git initialization
  if (cliOptions.git === undefined) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      initial: true,
    });
  }

  // Dependency installation
  if (cliOptions.install === undefined) {
    questions.push({
      type: "confirm",
      name: "install",
      message: "Install dependencies?",
      initial: true,
    });
  }

  // Run prompts if we have any questions
  let answers: Record<string, unknown> = {};
  if (questions.length > 0) {
    answers = await prompts(questions, {
      onCancel: () => {
        console.log(chalk.red("\n❌ Operation cancelled"));
        process.exit(1);
      },
    });
  }

  // Merge CLI options with interactive answers, CLI options take precedence
  return {
    db:
      cliOptions.db ??
      (answers.db as "sqlite" | "postgres" | "mysql") ??
      "sqlite",
    orm: cliOptions.orm ?? (answers.orm as "prisma" | "none") ?? "prisma",
    lint: cliOptions.lint ?? (answers.lint as "biome" | "eslint") ?? "biome",
    git: cliOptions.git ?? (answers.git as boolean) ?? true,
    install: cliOptions.install ?? (answers.install as boolean) ?? true,
  };
}

/**
 * Interactive prompt for project name when not provided
 */
export async function promptForProjectName(): Promise<string> {
  console.log(chalk.blue.bold("🚀 Create Fastify Project"));
  console.log(
    chalk.gray(
      "A modern monorepo template with Fastify API + React Router 7 frontend\n"
    )
  );

  const response = await prompts(
    {
      type: "text",
      name: "projectName",
      message: "What would you like to name your project?",
      initial: "my-fastify-app",
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return "Project name is required";
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
          return "Project name must contain only lowercase letters, numbers, and hyphens";
        }
        return true;
      },
    },
    {
      onCancel: () => {
        console.log(chalk.red("\n❌ Operation cancelled"));
        process.exit(1);
      },
    }
  );

  return response.projectName;
}

/**
 * Full interactive mode - prompts for both project name and options
 */
export async function runInteractiveMode(): Promise<InteractiveOptions> {
  const projectName = await promptForProjectName();
  const options = await promptForOptions({});

  return {
    projectName,
    ...options,
  };
}
