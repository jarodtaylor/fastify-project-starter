import { existsSync } from "node:fs";
import { access, constants } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import {
  checkFileSystemHealth,
  EnhancedError,
} from "../helpers/error-handling.js";
import {
  validateProjectOptions,
  checkNetworkEnvironment,
} from "../helpers/validation.js";
import type { ProjectOptions } from "../helpers/types.js";

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
    console.log(chalk.yellow("⚠️  Warnings detected:"));
    for (const issue of issues) {
      console.log(chalk.yellow(`   • ${issue}`));
    }
    console.log(); // Extra spacing
  }

  // Check network environment
  const { warnings } = checkNetworkEnvironment();
  if (warnings.length > 0) {
    console.log(chalk.blue("ℹ️  Environment notes:"));
    for (const warning of warnings) {
      console.log(chalk.blue(`   • ${warning}`));
    }
    console.log(); // Extra spacing
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
      console.log(chalk.red(`❌ Missing essential file: ${file}`));
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
        console.log(chalk.red(`❌ Missing Prisma file: ${file}`));
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
  console.log(chalk.yellow("\n⚠️  Manual setup required"));
  console.log(chalk.cyan("\n📁 Navigate to your project:"));
  console.log(chalk.cyan(`   cd ${projectName}`));

  if (!options.install) {
    console.log(chalk.cyan("\n📦 Install dependencies:"));
    console.log(chalk.cyan("   pnpm install"));
  }

  if (options.orm === "prisma") {
    console.log(chalk.cyan("\n🗄️  Set up database:"));
    console.log(chalk.cyan("   cp .env.example .env"));
    if (options.db !== "sqlite") {
      console.log(
        chalk.cyan(
          `   # Update DATABASE_URL in .env for ${options.db.toUpperCase()}`
        )
      );
    }
    console.log(chalk.cyan("   cd packages/database"));
    console.log(chalk.cyan("   pnpm prisma generate"));
    console.log(chalk.cyan("   pnpm prisma db push"));
    console.log(chalk.cyan("   cd ../.."));
  }

  if (!options.git) {
    console.log(chalk.cyan("\n🔄 Initialize git (optional):"));
    console.log(chalk.cyan("   git init"));
    console.log(chalk.cyan("   git add ."));
    console.log(chalk.cyan("   git commit -m 'Initial commit'"));
  }

  console.log(chalk.cyan("\n🚀 Start development:"));
  console.log(chalk.cyan("   pnpm dev"));
  console.log(
    chalk.dim("\n💡 Check the README.md for more detailed instructions")
  );
}

/**
 * Display success message when project is created successfully
 */
export function displaySuccessMessage(
  projectName: string,
  options: ProjectOptions
): void {
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
