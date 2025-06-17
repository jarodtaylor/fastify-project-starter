import { execa, type ExecaError } from "execa";
import type { Ora } from "ora";
import { handleGitError } from "../helpers/error-handling";

/**
 * Handle git initialization with enhanced error handling
 */
export async function initializeGit(
  projectPath: string,
  spinner: Ora
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
