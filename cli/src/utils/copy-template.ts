import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { cp, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { ProjectOptions } from "../create-project.js";

const EXCLUDE_PATTERNS = [
	"node_modules",
	".git",
	"cli",
	"scripts",
	".turbo",
	"dist",
	"build",
	".next",
	".react-router",
	"*.log",
	".DS_Store",
	"*.db",
];

function shouldExclude(filename: string): boolean {
	return EXCLUDE_PATTERNS.some((pattern) => {
		if (pattern.includes("*")) {
			const regex = new RegExp(pattern.replace(/\*/g, ".*"));
			return regex.test(filename);
		}
		// Exact match for directories ending with / or exact filename match
		if (pattern.endsWith("/")) {
			return filename === pattern.slice(0, -1);
		}
		return filename === pattern;
	});
}

async function copyRecursive(src: string, dest: string): Promise<void> {
	const entries = await readdir(src);

	for (const entry of entries) {
		if (shouldExclude(entry)) {
			continue;
		}

		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		const stats = await stat(srcPath);

		if (stats.isDirectory()) {
			if (!existsSync(destPath)) {
				mkdirSync(destPath, { recursive: true });
			}
			await copyRecursive(srcPath, destPath);
		} else {
			await cp(srcPath, destPath);
		}
	}
}

export async function copyTemplate(
	templatePath: string,
	targetPath: string,
	options: ProjectOptions,
): Promise<void> {
	// The templatePath should point to the bundled template directory
	// Verify it contains the expected structure
	const expectedFiles = ["package.json", "apps", "packages"];
	const hasExpectedStructure = expectedFiles.every((file) =>
		existsSync(join(templatePath, file)),
	);

	if (!hasExpectedStructure) {
		throw new Error(
			`Template source does not contain expected project structure at: ${templatePath}`,
		);
	}

	// Copy the contents of the template directory directly to target
	await copyRecursive(templatePath, targetPath);

	// Ensure data directory exists with .gitkeep for SQLite database
	const dataDir = join(targetPath, "data");
	if (!existsSync(dataDir)) {
		mkdirSync(dataDir, { recursive: true });
	}
	const gitkeepPath = join(dataDir, ".gitkeep");
	if (!existsSync(gitkeepPath)) {
		await cp(join(templatePath, "data", ".gitkeep"), gitkeepPath).catch(() => {
			// If .gitkeep doesn't exist in template, create an empty one
			writeFileSync(gitkeepPath, "");
		});
	}
}
