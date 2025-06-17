import { execa, type ExecaError } from "execa";
import type { Ora } from "ora";
import { handlePackageManagerError } from "../helpers/error-handling.js";

/**
 * Handle dependency installation with enhanced error handling
 */
export async function installDependencies(
  projectPath: string,
  spinner: Ora
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
        "Could not format generated code (this is usually not critical)"
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
