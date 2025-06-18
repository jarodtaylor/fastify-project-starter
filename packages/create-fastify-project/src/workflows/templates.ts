import { readFileSync, writeFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import chalk from "chalk";
import type { Ora } from "ora";
import { copyTemplate } from "../helpers/copy-template";
import { handleFileSystemError } from "../helpers/error-handling";
import { replaceTemplateVars } from "../helpers/replace-vars";
import {
  displayVersionUpdates,
  extractCurrentVersions,
  fetchLatestVersions,
  updatePackageVersions,
} from "../helpers/version-fetcher";

import type { ProjectOptions } from "../types";

/**
 * Copy template files to project directory
 */
export async function copyTemplateFiles(
  templatePath: string,
  projectPath: string,
  options: ProjectOptions,
  spinner: Ora,
): Promise<void> {
  spinner.start("Copying template files...");
  try {
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
}

/**
 * Customize template with project-specific variables
 */
export async function customizeTemplate(
  projectPath: string,
  projectName: string,
  options: ProjectOptions,
  spinner: Ora,
): Promise<void> {
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
}

/**
 * Update dependencies to latest versions
 */
export async function updateVersions(
  projectPath: string,
  spinner: Ora,
): Promise<void> {
  spinner.start("Checking for latest package versions...");

  try {
    // Find all package.json files in the project
    const packageJsonPaths = await findPackageJsonFiles(projectPath);

    if (packageJsonPaths.length === 0) {
      spinner.warn("No package.json files found to update");
      return;
    }

    let totalUpdates = 0;

    // Process each package.json file
    for (const packageJsonPath of packageJsonPaths) {
      try {
        const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
        const currentVersions = extractCurrentVersions(packageJsonContent);

        // Get list of packages to check (only those that exist in this package.json)
        const packagesToCheck = [
          "react-router",
          "fastify",
          "typescript",
          "vite",
          "@types/node",
          "tsx",
          "prisma",
          "@prisma/client",
          "@vitejs/plugin-react",
          "biome",
          "@biomejs/biome",
        ].filter((pkg) => currentVersions[pkg]);

        if (packagesToCheck.length > 0) {
          // Fetch latest versions
          const versionUpdates = await fetchLatestVersions(
            packagesToCheck,
            currentVersions,
            { timeout: 3000 },
          );

          // Update package.json content
          const updatedContent = updatePackageVersions(
            packageJsonContent,
            versionUpdates,
          );

          if (updatedContent !== packageJsonContent) {
            writeFileSync(packageJsonPath, updatedContent);
            const updates = versionUpdates.filter((v) => v.updated);
            totalUpdates += updates.length;
          }
        }
      } catch (error) {
        // Continue with other package.json files if one fails
      }
    }

    if (totalUpdates > 0) {
      spinner.succeed(`Updated ${totalUpdates} packages to latest versions`);

      // Show summary of updates (for the main package.json)
      const mainPackageJsonPath = resolve(projectPath, "package.json");
      if (packageJsonPaths.includes(mainPackageJsonPath)) {
        const content = readFileSync(mainPackageJsonPath, "utf-8");
        const currentVersions = extractCurrentVersions(content);
        const packagesToCheck = [
          "react-router",
          "fastify",
          "typescript",
          "vite",
          "@types/node",
          "tsx",
          "prisma",
          "@prisma/client",
        ].filter((pkg) => currentVersions[pkg]);

        const versionUpdates = await fetchLatestVersions(
          packagesToCheck,
          currentVersions,
        );
        displayVersionUpdates(versionUpdates);
      }
    } else {
      spinner.succeed("All dependencies are up to date");
    }
  } catch (error) {
    spinner.warn("Version check failed, continuing with template versions");
    console.log(
      chalk.yellow(
        "⚠️  Unable to check for latest versions, using template defaults",
      ),
    );
  }
}

/**
 * Find all package.json files in the project directory
 */
async function findPackageJsonFiles(projectPath: string): Promise<string[]> {
  const packageJsonFiles: string[] = [];

  async function searchDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await readdir(dirPath);

      for (const entry of entries) {
        const fullPath = resolve(dirPath, entry);
        const stats = await stat(fullPath);

        if (stats.isFile() && entry === "package.json") {
          packageJsonFiles.push(fullPath);
        } else if (
          stats.isDirectory() &&
          !entry.startsWith(".") &&
          entry !== "node_modules"
        ) {
          await searchDirectory(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  await searchDirectory(projectPath);
  return packageJsonFiles;
}
