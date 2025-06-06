import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import { type ExecaError, execa } from "execa";
import ora, { type Ora } from "ora";
import { copyTemplate } from "./utils/copy-template.js";
import {
	EnhancedError,
	checkFileSystemHealth,
	handleFileSystemError,
	handleGitError,
	handleNetworkError,
	handlePackageManagerError,
} from "./utils/error-handling.js";
import { promptForOptions } from "./utils/prompts.js";
import { replaceTemplateVars } from "./utils/replace-vars.js";
import {
	checkNetworkEnvironment,
	validateProjectOptions,
} from "./utils/validation.js";

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
	cliOptions: Partial<ProjectOptions>,
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

	// Copy template files
	spinner.start("Copying template files...");
	try {
		const templatePath = resolve(__dirname, "../template");
		await copyTemplate(templatePath, projectPath, options);
		spinner.succeed("Copied template files");
	} catch (error) {
		spinner.fail("Failed to copy template files");
		const enhancedError = handleFileSystemError(error as Error, {
			operation: "Template copying",
			projectPath,
			details: "Unable to copy template files to project directory",
		});
		enhancedError.display();
		process.exit(1);
	}

	// Replace template variables
	spinner.start("Customizing template...");
	try {
		await replaceTemplateVars(projectPath, projectName, options);
		spinner.succeed("Customized template");
	} catch (error) {
		spinner.fail("Failed to customize template");
		const enhancedError = handleFileSystemError(error as Error, {
			operation: "Template customization",
			projectPath,
			details: "Unable to customize template variables",
		});
		enhancedError.display();
		process.exit(1);
	}

	// Install dependencies with enhanced error handling
	let dependenciesInstalled = false;
	if (options.install) {
		dependenciesInstalled = await handleDependencyInstallation(
			projectPath,
			spinner,
		);
	}

	// Initialize database (only if dependencies are installed)
	if (options.orm === "prisma" && dependenciesInstalled) {
		await handleDatabaseSetup(projectPath, spinner);
	} else if (options.orm === "prisma" && !dependenciesInstalled) {
		console.log(
			chalk.yellow(
				"⚠️  Skipping database setup because dependencies installation failed",
			),
		);
	}

	// Initialize git with enhanced error handling
	if (options.git) {
		await handleGitInitialization(projectPath, spinner);
	}

	// Validate project setup
	spinner.start("Validating project setup...");
	const hasErrors = await validateProject(projectPath, options);

	if (hasErrors) {
		spinner.fail("Project created with issues");
		displayManualSetupInstructions(projectName, options);
	} else {
		spinner.succeed("Project validated successfully");
		displaySuccessMessage(projectName);
	}
}

/**
 * Enhanced pre-flight checks before project creation
 */
async function performPreFlightChecks(
	projectPath: string,
	cliOptions: Partial<ProjectOptions>,
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
			},
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
 * Handle dependency installation with enhanced error handling
 */
async function handleDependencyInstallation(
	projectPath: string,
	spinner: Ora,
): Promise<boolean> {
	spinner.start("Installing dependencies...");
	try {
		await execa("pnpm", ["install"], { cwd: projectPath });
		spinner.succeed("Installed dependencies");

		// Format generated code after dependencies are installed
		spinner.start("Formatting generated code...");
		try {
			await execa("pnpm", ["format"], { cwd: projectPath });
			spinner.succeed("Formatted generated code");
		} catch (error) {
			spinner.warn(
				"Could not format generated code (this is usually not critical)",
			);
		}

		return true;
	} catch (error) {
		spinner.fail("Failed to install dependencies");
		const enhancedError = handlePackageManagerError(error as ExecaError, {
			operation: "Dependency installation",
			projectPath,
			command: "pnpm install",
		});
		enhancedError.display();
		return false;
	}
}

/**
 * Handle database setup with enhanced error handling
 */
async function handleDatabaseSetup(
	projectPath: string,
	spinner: Ora,
): Promise<void> {
	spinner.start("Setting up database...");
	try {
		// Copy .env files to both root and database package
		await execa("cp", [".env.example", ".env"], { cwd: projectPath });
		await execa(
			"cp",
			["packages/database/.env.example", "packages/database/.env"],
			{ cwd: projectPath },
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
				error as Error,
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
 * Handle git initialization with enhanced error handling
 */
async function handleGitInitialization(
	projectPath: string,
	spinner: Ora,
): Promise<void> {
	spinner.start("Initializing git repository...");
	try {
		await execa("git", ["init"], { cwd: projectPath });
		await execa("git", ["add", "."], { cwd: projectPath });
		await execa("git", ["commit", "-m", "Initial commit"], {
			cwd: projectPath,
		});
		spinner.succeed("Initialized git repository");
	} catch (error) {
		spinner.warn("Git initialization failed (this is not critical)");
		const enhancedError = handleGitError(error as ExecaError, {
			operation: "Git initialization",
			projectPath,
			command: "git init/add/commit",
		});
		enhancedError.display();
	}
}

/**
 * Display manual setup instructions for when automated setup fails
 */
function displayManualSetupInstructions(
	projectName: string,
	options: ProjectOptions,
): void {
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
			chalk.cyan("   cp packages/database/.env.example packages/database/.env"),
		);
		console.log(chalk.cyan("   cd packages/database && pnpm prisma generate"));
		console.log(chalk.cyan("   cd packages/database && pnpm prisma db push"));
	}

	console.log(chalk.yellow("\n🚀 Start development:"));
	console.log(chalk.cyan("   pnpm dev"));

	console.log(
		chalk.dim("\n💡 Need help? Check the README.md or report issues at:"),
	);
	console.log(
		chalk.dim(
			"   https://github.com/jarodtaylor/fastify-react-router-starter/issues",
		),
	);

	console.log(
		chalk.red(
			"\n❌ Setup incomplete - follow the steps above before running pnpm dev",
		),
	);
}

/**
 * Display success message when project is created successfully
 */
function displaySuccessMessage(projectName: string): void {
	console.log(chalk.green("\n✨ Project created successfully!"));
	console.log(chalk.yellow("\nNext steps:"));
	console.log(chalk.cyan(`  cd ${projectName}`));
	console.log(chalk.cyan("  pnpm dev"));
	console.log(chalk.green("\nHappy coding! 🎉"));
}

async function validateProject(
	projectPath: string,
	options: ProjectOptions,
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
