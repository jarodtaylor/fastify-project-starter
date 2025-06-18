import chalk from "chalk";
import ora, { type Ora } from "ora";

/**
 * Professional CLI logger with styled output
 * Inspired by create-next-app, Vercel CLI, and modern CLI tools
 */
export class Logger {
  private activeSpinner: Ora | null = null;

  /**
   * Log a success message with green checkmark
   */
  success(message: string): void {
    this.stopSpinner();
    console.log(chalk.green(`✓ ${message}`));
  }

  /**
   * Log an error message with red X
   */
  error(message: string): void {
    this.stopSpinner();
    console.log(chalk.red(`✗ ${message}`));
  }

  /**
   * Log a warning message with yellow triangle
   */
  warn(message: string): void {
    this.stopSpinner();
    console.log(chalk.yellow(`⚠ ${message}`));
  }

  /**
   * Log an info message with blue info icon
   */
  info(message: string): void {
    this.stopSpinner();
    console.log(chalk.blue(`ℹ ${message}`));
  }

  /**
   * Log a step in a process with cyan arrow
   */
  step(command: string): void {
    console.log(chalk.cyan(`  ${command}`));
  }

  /**
   * Log a command to run with subtle styling
   */
  command(command: string): void {
    console.log(chalk.dim(`  $ ${command}`));
  }

  /**
   * Create a title/header with gradient-like styling
   */
  title(text: string): void {
    this.stopSpinner();
    console.log();
    console.log(chalk.bold.magenta(`🚀 ${text}`));
    console.log();
  }

  /**
   * Create a section header
   */
  section(text: string): void {
    console.log();
    console.log(chalk.bold.cyan(text));
  }

  /**
   * Log a subtle/dimmed message
   */
  dim(message: string): void {
    console.log(chalk.dim(message));
  }

  /**
   * Create a spinner with message
   */
  spinner(message: string): Ora {
    this.stopSpinner();
    this.activeSpinner = ora({
      text: message,
      color: "cyan",
      spinner: "dots",
    }).start();
    return this.activeSpinner;
  }

  /**
   * Stop the current spinner if active
   */
  stopSpinner(): void {
    if (this.activeSpinner) {
      this.activeSpinner.stop();
      this.activeSpinner = null;
    }
  }

  /**
   * Add a line break
   */
  break(): void {
    console.log();
  }

  /**
   * Log a list item with bullet point
   */
  listItem(text: string): void {
    console.log(chalk.dim(`  • ${text}`));
  }

  /**
   * Create a box around text for emphasis
   */
  box(title: string, items: string[]): void {
    console.log();
    console.log(chalk.bold.cyan(`📦 ${title}`));
    for (const item of items) {
      this.listItem(item);
    }
  }

  /**
   * Display a completion message with project info
   */
  completion(projectName: string, timeMs: number): void {
    this.break();
    console.log(
      chalk.green.bold(`🎉 Successfully created ${chalk.cyan(projectName)}`),
    );
    console.log(chalk.dim(`   Completed in ${timeMs}ms`));
    this.break();
  }

  /**
   * Display next steps in a formatted way
   */
  nextSteps(
    projectName: string,
    steps: Array<{ title: string; command?: string; description?: string }>,
  ): void {
    this.section("Next steps:");

    for (const [index, step] of steps.entries()) {
      console.log(chalk.cyan(`${index + 1}. ${step.title}`));
      if (step.command) {
        this.command(step.command);
      }
      if (step.description) {
        console.log(chalk.dim(`   ${step.description}`));
      }
      if (index < steps.length - 1) {
        console.log();
      }
    }

    this.break();
  }

  /**
   * Display project summary
   */
  summary(projectName: string, config: Record<string, string>): void {
    this.section("Project Configuration:");

    for (const [key, value] of Object.entries(config)) {
      console.log(chalk.dim(`  ${key}: `) + chalk.cyan(value));
    }

    this.break();
  }
}

// Export a singleton instance
export const logger = new Logger();

// Export individual functions for convenience
export const {
  success,
  error,
  warn,
  info,
  step,
  command,
  title,
  section,
  dim,
  spinner,
  break: logBreak,
  listItem,
  box,
  completion,
  nextSteps,
  summary,
} = logger;
