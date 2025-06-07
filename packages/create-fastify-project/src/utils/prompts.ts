import type { ProjectOptions } from "../create-project.js";

export async function promptForOptions(
  cliOptions: Partial<ProjectOptions>,
): Promise<ProjectOptions> {
  // For now, return defaults merged with provided options
  // We can implement full interactive prompts later

  return {
    db: cliOptions.db || "sqlite",
    orm: cliOptions.orm || "prisma",
    lint: cliOptions.lint || "biome",
    git: cliOptions.git !== undefined ? cliOptions.git : true,
    install: cliOptions.install !== undefined ? cliOptions.install : true,
  };
}
