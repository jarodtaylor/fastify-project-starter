import { resolve } from "node:path";
import { execa, type ExecaError } from "execa";
import type { Ora } from "ora";
import chalk from "chalk";
import {
  EnhancedError,
  handlePackageManagerError,
} from "../helpers/error-handling.js";
import type { ProjectOptions } from "../helpers/types.js";

/**
 * Handle database setup with enhanced error handling
 */
export async function setupDatabase(
  projectPath: string,
  spinner: Ora,
  options: ProjectOptions
): Promise<void> {
  spinner.start("Setting up database...");
  try {
    // Copy .env file to root only (no database package duplication)
    await execa("cp", [".env.example", ".env"], { cwd: projectPath });

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

    // Determine the specific type of error
    const errorMessage = (error as Error).message?.toLowerCase() || "";
    let enhancedError: EnhancedError;

    if (errorMessage.includes("prisma") || errorMessage.includes("not found")) {
      enhancedError = new EnhancedError(
        "Prisma setup failed",
        {
          operation: "Database setup",
          projectPath,
          command: "prisma generate/db push",
          details: (error as Error).message,
        },
        {
          message: "Prisma database setup encountered issues",
          steps: [
            "The project was created successfully but database setup failed",
            "You can set it up manually with the following commands:",
            "cd packages/database",
            "cp .env.example .env",
            "pnpm prisma generate",
            "pnpm prisma db push",
          ],
          helpUrl:
            "https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch",
        },
        error as Error
      );
    } else {
      enhancedError = handlePackageManagerError(error as ExecaError, {
        operation: "Database setup",
        projectPath,
        command: "prisma commands",
      });
    }

    enhancedError.display();
  }
}

/**
 * Handle external database setup (PostgreSQL/MySQL) - without attempting connection
 */
export async function setupExternalDatabase(
  projectPath: string,
  spinner: Ora,
  options: ProjectOptions
): Promise<void> {
  spinner.start("Setting up database configuration...");
  try {
    // Copy .env file to root only (no database package duplication)
    await execa("cp", [".env.example", ".env"], { cwd: projectPath });

    // Generate Prisma client (run from database package directory)
    await execa("pnpm", ["prisma", "generate"], {
      cwd: resolve(projectPath, "packages/database"),
    });

    spinner.succeed("Set up database configuration");

    // Display database-specific setup instructions
    console.log(
      chalk.yellow(`\n🗄️  ${options.db.toUpperCase()} Database Setup Required:`)
    );
    console.log(chalk.cyan("   1. Set up your database server"));
    console.log(
      chalk.cyan(
        `   2. Update DATABASE_URL in .env with your ${options.db} connection string`
      )
    );
    console.log(
      chalk.cyan("   3. Run: cd packages/database && pnpm prisma db push")
    );
    console.log(chalk.dim("   💡 See README.md for database setup examples"));
  } catch (error) {
    spinner.fail("Failed to set up database configuration");
    console.log(
      chalk.red(`❌ Database configuration failed: ${(error as Error).message}`)
    );
    console.log(chalk.yellow("\n🔧 Manual setup required:"));
    console.log(chalk.cyan("   cp .env.example .env  # From project root"));
    console.log(chalk.cyan("   cd packages/database && pnpm prisma generate"));
  }
}
