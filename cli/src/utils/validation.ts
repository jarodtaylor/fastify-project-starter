import { existsSync } from "node:fs";
import { resolve } from "node:path";
import inquirer from "inquirer";
import validateNpmPackageName from "validate-npm-package-name";

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
