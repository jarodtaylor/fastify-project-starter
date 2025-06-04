import { existsSync } from "node:fs";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { rm } from "node:fs/promises";
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

	// Handle linter-specific configurations
	if (options.lint === "eslint") {
		await configureLinter(projectPath, options.lint);
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
	try {
		// Remove the entire database package
		const databasePackagePath = join(projectPath, "packages", "database");
		if (existsSync(databasePackagePath)) {
			await rm(databasePackagePath, { recursive: true, force: true });
		}

		// Remove database-related scripts from root package.json
		const rootPackageJsonPath = join(projectPath, "package.json");
		if (existsSync(rootPackageJsonPath)) {
			const packageContent = await readFile(rootPackageJsonPath, "utf-8");
			const packageJson = JSON.parse(packageContent);

			// Remove database scripts using destructuring
			if (packageJson.scripts) {
				const {
					"db:generate": _generate,
					"db:push": _push,
					"db:reset": _reset,
					"db:studio": _studio,
					"db:migrate": _migrate,
					...remainingScripts
				} = packageJson.scripts;
				packageJson.scripts = remainingScripts;
			}

			await writeFile(
				rootPackageJsonPath,
				JSON.stringify(packageJson, null, "\t"),
				"utf-8",
			);
		}

		// Update workspace configuration to remove database package
		const workspaceConfigPath = join(projectPath, "pnpm-workspace.yaml");
		if (existsSync(workspaceConfigPath)) {
			let workspaceContent = await readFile(workspaceConfigPath, "utf-8");
			workspaceContent = workspaceContent.replace(
				/\s*- "packages\/database"/g,
				"",
			);
			await writeFile(workspaceConfigPath, workspaceContent, "utf-8");
		}

		// Remove database imports from API if they exist
		const apiIndexPath = join(projectPath, "apps", "api", "src", "index.ts");
		if (existsSync(apiIndexPath)) {
			let apiContent = await readFile(apiIndexPath, "utf-8");
			// Remove database-related imports with more specific patterns
			apiContent = apiContent.replace(
				/import.*from\s+['"]@[^'"]*\/database['"];\n?/g,
				"",
			);
			apiContent = apiContent.replace(
				/import.*from\s+['"]@prisma\/client['"];\n?/g,
				"",
			);
			apiContent = apiContent.replace(
				/import.*from\s+['"]\.\.?\/.*database.*['"];\n?/g,
				"",
			);
			await writeFile(apiIndexPath, apiContent, "utf-8");
		}

		// Remove database-related routes
		const apiRoutesPath = join(projectPath, "apps", "api", "src", "routes");
		if (existsSync(apiRoutesPath)) {
			const routeFiles = await readdir(apiRoutesPath);
			for (const file of routeFiles) {
				if (file.includes("todo") || file.includes("db")) {
					await rm(join(apiRoutesPath, file), { force: true });
				}
			}
		}

		console.log("✓ Removed Prisma configuration and database package");
	} catch (error) {
		console.warn("Warning: Could not fully remove Prisma configuration");
	}
}

async function configureLinter(
	projectPath: string,
	linter: "eslint",
): Promise<void> {
	try {
		// Remove Biome configuration file
		const biomeConfigPath = join(projectPath, "biome.json");
		if (existsSync(biomeConfigPath)) {
			await rm(biomeConfigPath, { force: true });
		}

		// Update root package.json to replace Biome with ESLint
		const rootPackageJsonPath = join(projectPath, "package.json");
		if (existsSync(rootPackageJsonPath)) {
			const packageContent = await readFile(rootPackageJsonPath, "utf-8");
			const packageJson = JSON.parse(packageContent);

			// Remove Biome dependency and add ESLint dependencies
			if (packageJson.devDependencies) {
				const { "@biomejs/biome": _biome, ...remainingDevDeps } =
					packageJson.devDependencies;

				packageJson.devDependencies = {
					...remainingDevDeps,
					eslint: "^9.17.0",
					"@typescript-eslint/eslint-plugin": "^8.18.1",
					"@typescript-eslint/parser": "^8.18.1",
					"eslint-config-prettier": "^9.1.0",
					prettier: "^3.4.2",
				};
			}

			// Update scripts to use ESLint instead of Biome
			if (packageJson.scripts) {
				const {
					format: _format,
					"format:check": _formatCheck,
					check: _check,
					...remainingScripts
				} = packageJson.scripts;

				packageJson.scripts = {
					...remainingScripts,
					lint: "eslint . --ext .ts,.tsx,.js,.jsx",
					"lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
					format: "prettier --write .",
					"format:check": "prettier --check .",
					check: "pnpm lint && pnpm typecheck",
				};
			}

			await writeFile(
				rootPackageJsonPath,
				JSON.stringify(packageJson, null, "\t"),
				"utf-8",
			);
		}

		// Create ESLint configuration file
		const eslintConfig = {
			root: true,
			env: {
				browser: true,
				es2022: true,
				node: true,
			},
			extends: [
				"eslint:recommended",
				"@typescript-eslint/recommended",
				"prettier",
			],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			plugins: ["@typescript-eslint"],
			rules: {
				"@typescript-eslint/no-unused-vars": [
					"error",
					{ argsIgnorePattern: "^_" },
				],
				"@typescript-eslint/no-explicit-any": "warn",
			},
			ignorePatterns: ["dist/", "build/", "node_modules/", ".turbo/"],
		};

		const eslintConfigPath = join(projectPath, "eslint.config.js");
		const eslintConfigContent = `module.exports = ${JSON.stringify(
			eslintConfig,
			null,
			2,
		)};`;
		await writeFile(eslintConfigPath, eslintConfigContent, "utf-8");

		// Create Prettier configuration file
		const prettierConfig = {
			semi: true,
			trailingComma: "es5",
			singleQuote: false,
			printWidth: 80,
			tabWidth: 2,
			useTabs: false,
		};

		const prettierConfigPath = join(projectPath, ".prettierrc");
		await writeFile(
			prettierConfigPath,
			JSON.stringify(prettierConfig, null, 2),
			"utf-8",
		);

		console.log("✓ Configured ESLint and Prettier");
	} catch (error) {
		console.warn("Warning: Could not fully configure ESLint");
	}
}
