import { existsSync } from "node:fs";
import { resolve } from "node:path";
import inquirer from "inquirer";
import validateNpmPackageName from "validate-npm-package-name";
import type { ProjectOptions } from "../create-project.js";

export async function validateProjectName(
	providedName?: string,
): Promise<string> {
	if (providedName) {
		const validation = validateNpmPackageName(providedName);
		if (validation.validForNewPackages) {
			// Check if directory already exists
			if (existsSync(resolve(process.cwd(), providedName))) {
				throw new Error(`Directory "${providedName}" already exists`);
			}
			return providedName;
		}
		throw new Error(
			`Invalid project name: ${
				validation.errors?.join(", ") || "Unknown error"
			}`,
		);
	}

	// Prompt for project name if not provided
	const { projectName } = await inquirer.prompt([
		{
			type: "input",
			name: "projectName",
			message: "What is your project name?",
			default: "my-fastify-react-app",
			validate: (input: string) => {
				const validation = validateNpmPackageName(input);
				if (!validation.validForNewPackages) {
					return `Invalid project name: ${
						validation.errors?.join(", ") || "Unknown error"
					}`;
				}
				if (existsSync(resolve(process.cwd(), input))) {
					return `Directory "${input}" already exists`;
				}
				return true;
			},
		},
	]);

	return projectName;
}

export function validateProjectOptions(options: Partial<ProjectOptions>): void {
	// Validate database option
	if (options.db && !["sqlite", "postgres", "mysql"].includes(options.db)) {
		throw new Error(
			`Invalid database option: ${options.db}. Must be one of: sqlite, postgres, mysql`,
		);
	}

	// Validate ORM option
	if (options.orm && !["prisma", "none"].includes(options.orm)) {
		throw new Error(
			`Invalid ORM option: ${options.orm}. Must be one of: prisma, none`,
		);
	}

	// Validate linter option
	if (options.lint && !["biome", "eslint"].includes(options.lint)) {
		throw new Error(
			`Invalid linter option: ${options.lint}. Must be one of: biome, eslint`,
		);
	}

	// Validate boolean options
	if (options.install !== undefined && typeof options.install !== "boolean") {
		throw new Error("Install option must be a boolean");
	}

	if (options.git !== undefined && typeof options.git !== "boolean") {
		throw new Error("Git option must be a boolean");
	}

	// Validate logical combinations
	if (options.orm === "none" && options.db && options.db !== "sqlite") {
		console.warn(
			"⚠️  Warning: Database option is ignored when ORM is set to 'none'",
		);
	}
}
