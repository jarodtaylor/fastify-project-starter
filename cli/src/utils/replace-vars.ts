import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectOptions } from "../create-project.js";

const FILES_TO_PROCESS = [
	"package.json",
	"tsconfig.json",
	"turbo.json",
	"README.md",
	"DEVELOPMENT.md",
	".env.example",
];

const TEMPLATE_VARS = {
	PROJECT_NAME: "fastify-react-router-starter",
	PACKAGE_SCOPE: "@fastify-react-router-starter",
	AUTHOR_NAME: "Jarod Taylor",
	AUTHOR_EMAIL: "jarodrtaylor@gmail.com",
	REPO_URL: "https://github.com/jarodtaylor/fastify-react-router-starter",
};

function generatePackageScope(projectName: string): string {
	// Convert kebab-case to @scope format
	return `@${projectName}`;
}

function generateReplacements(projectName: string, options: ProjectOptions) {
	const packageScope = generatePackageScope(projectName);

	return {
		[TEMPLATE_VARS.PROJECT_NAME]: projectName,
		[TEMPLATE_VARS.PACKAGE_SCOPE]: packageScope,
		// Keep author info as placeholder for user to customize
		[TEMPLATE_VARS.AUTHOR_NAME]: "Your Name",
		[TEMPLATE_VARS.AUTHOR_EMAIL]: "your.email@example.com",
		[TEMPLATE_VARS.REPO_URL]: `https://github.com/yourusername/${projectName}`,
	};
}

async function processFile(
	filePath: string,
	replacements: Record<string, string>,
): Promise<void> {
	try {
		let content = await readFile(filePath, "utf-8");

		// Apply all replacements
		for (const [search, replace] of Object.entries(replacements)) {
			content = content.replace(new RegExp(search, "g"), replace);
		}

		await writeFile(filePath, content, "utf-8");
	} catch (error) {
		// File might not exist or be readable, skip it
		console.warn(`Warning: Could not process file ${filePath}`);
	}
}

async function processDirectory(
	dirPath: string,
	replacements: Record<string, string>,
): Promise<void> {
	try {
		const entries = await readdir(dirPath);

		for (const entry of entries) {
			const fullPath = join(dirPath, entry);
			const stats = await stat(fullPath);

			if (stats.isDirectory()) {
				// Skip node_modules and other build directories
				if (
					!["node_modules", ".git", ".turbo", "dist", "build"].includes(entry)
				) {
					await processDirectory(fullPath, replacements);
				}
			} else if (
				FILES_TO_PROCESS.includes(entry) ||
				entry.endsWith(".ts") ||
				entry.endsWith(".tsx") ||
				entry.endsWith(".js") ||
				entry.endsWith(".jsx")
			) {
				await processFile(fullPath, replacements);
			}
		}
	} catch (error) {
		console.warn(`Warning: Could not process directory ${dirPath}`);
	}
}

export async function replaceTemplateVars(
	projectPath: string,
	projectName: string,
	options: ProjectOptions,
): Promise<void> {
	const replacements = generateReplacements(projectName, options);

	// Process all files in the project
	await processDirectory(projectPath, replacements);

	// Handle database-specific configurations
	if (options.db !== "sqlite") {
		await updateDatabaseConfig(projectPath, options.db);
		await updatePrismaSchema(projectPath, options.db);
		await updateDatabaseDependencies(projectPath, options.db);
	}

	// Handle ORM-specific configurations
	if (options.orm === "none") {
		await removePrismaConfig(projectPath);
	}
}

async function updateDatabaseConfig(
	projectPath: string,
	dbType: "postgres" | "mysql",
): Promise<void> {
	// Update root .env.example
	const envPath = join(projectPath, ".env.example");
	await updateEnvFile(envPath, dbType);

	// Update database package .env.example
	const dbEnvPath = join(projectPath, "packages", "database", ".env.example");
	await updateEnvFile(dbEnvPath, dbType);
}

async function updateEnvFile(
	envPath: string,
	dbType: "postgres" | "mysql",
): Promise<void> {
	try {
		let envContent = await readFile(envPath, "utf-8");

		if (dbType === "postgres") {
			envContent = envContent.replace(
				'DATABASE_URL="file:../../data/dev.db"',
				'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"',
			);
		} else if (dbType === "mysql") {
			envContent = envContent.replace(
				'DATABASE_URL="file:../../data/dev.db"',
				'DATABASE_URL="mysql://user:password@localhost:3306/mydb"',
			);
		}

		await writeFile(envPath, envContent, "utf-8");
	} catch (error) {
		console.warn(`Warning: Could not update ${envPath}`);
	}
}

async function updatePrismaSchema(
	projectPath: string,
	dbType: "postgres" | "mysql",
): Promise<void> {
	const schemaPath = join(
		projectPath,
		"packages",
		"database",
		"prisma",
		"schema.prisma",
	);

	try {
		let schemaContent = await readFile(schemaPath, "utf-8");

		// Update the provider
		if (dbType === "postgres") {
			schemaContent = schemaContent.replace(
				'provider = "sqlite"',
				'provider = "postgresql"',
			);
		} else if (dbType === "mysql") {
			schemaContent = schemaContent.replace(
				'provider = "sqlite"',
				'provider = "mysql"',
			);
		}

		await writeFile(schemaPath, schemaContent, "utf-8");
	} catch (error) {
		console.warn("Warning: Could not update Prisma schema");
	}
}

async function updateDatabaseDependencies(
	projectPath: string,
	dbType: "postgres" | "mysql",
): Promise<void> {
	const packageJsonPath = join(
		projectPath,
		"packages",
		"database",
		"package.json",
	);

	try {
		const packageContent = await readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageContent);

		// Add appropriate database driver
		if (dbType === "postgres") {
			packageJson.dependencies = {
				...packageJson.dependencies,
				pg: "^8.11.3",
			};
			packageJson.devDependencies = {
				...packageJson.devDependencies,
				"@types/pg": "^8.10.9",
			};
		} else if (dbType === "mysql") {
			packageJson.dependencies = {
				...packageJson.dependencies,
				mysql2: "^3.6.5",
			};
		}

		await writeFile(
			packageJsonPath,
			JSON.stringify(packageJson, null, "\t"),
			"utf-8",
		);
	} catch (error) {
		console.warn("Warning: Could not update database package.json");
	}
}

async function removePrismaConfig(projectPath: string): Promise<void> {
	// This would remove Prisma-related files and dependencies
	// For now, just log that this option was selected
	console.log(
		"Note: --orm=none selected. You may want to remove Prisma-related files manually.",
	);
}
