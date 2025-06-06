#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
	// Development and contributor files
	".github",
	"CONTRIBUTING.md",
	"DEVELOPMENT.md",
	// Environment files (only .env.example should be copied)
	".env",
	".env.local",
	// Docker files for default template (can be added later as option)
	"**/Dockerfile",
	"**/.dockerignore",
];

function shouldExclude(filename, fullPath) {
	return EXCLUDE_PATTERNS.some((pattern) => {
		// Handle ** patterns for nested paths
		if (pattern.includes("**")) {
			if (fullPath) {
				const regex = new RegExp(
					pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"),
				);
				return regex.test(fullPath);
			}
			return false;
		}

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

function copyRecursive(src, dest, basePath = "") {
	if (!fs.existsSync(dest)) {
		fs.mkdirSync(dest, { recursive: true });
	}

	const entries = fs.readdirSync(src);

	for (const entry of entries) {
		const relativePath = basePath ? `${basePath}/${entry}` : entry;

		if (shouldExclude(entry, relativePath)) {
			continue;
		}

		const srcPath = path.join(src, entry);
		const destPath = path.join(dest, entry);
		const stats = fs.statSync(srcPath);

		if (stats.isDirectory()) {
			copyRecursive(srcPath, destPath, relativePath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

// Copy from parent directory to template directory
const projectRoot = path.resolve(__dirname, "../..");
const templateDest = path.resolve(__dirname, "../template");

console.log("Copying template files...");
console.log(`From: ${projectRoot}`);
console.log(`To: ${templateDest}`);

// Clean existing template directory
if (fs.existsSync(templateDest)) {
	fs.rmSync(templateDest, { recursive: true });
}

copyRecursive(projectRoot, templateDest);

// Ensure data directory exists with .gitkeep
const dataDir = path.join(templateDest, "data");
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}
const gitkeepPath = path.join(dataDir, ".gitkeep");
if (!fs.existsSync(gitkeepPath)) {
	fs.writeFileSync(gitkeepPath, "");
}

console.log("Template files copied successfully!");
