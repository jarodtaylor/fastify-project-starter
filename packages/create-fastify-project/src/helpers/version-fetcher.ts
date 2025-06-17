import chalk from "chalk";

export interface VersionInfo {
  name: string;
  current: string;
  latest: string;
  updated: boolean;
}

export interface VersionFetchOptions {
  timeout?: number;
  fallbackToTemplate?: boolean;
  registryUrl?: string;
}

/**
 * Fetches the latest version of a package from npm registry
 */
async function fetchPackageVersion(
  packageName: string,
  options: VersionFetchOptions = {}
): Promise<string | null> {
  const { timeout = 5000, registryUrl = "https://registry.npmjs.org" } =
    options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${registryUrl}/${packageName}/latest`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "create-fastify-project",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { version?: string };
    return data.version || null;
  } catch (error) {
    // Network error, timeout, or other issues
    return null;
  }
}

/**
 * Core packages that should always be updated to latest versions
 */
const CORE_PACKAGES = [
  "react-router",
  "fastify",
  "typescript",
  "vite",
  "@types/node",
  "tsx",
  "prisma",
  "@prisma/client",
] as const;

/**
 * Packages that should be kept at specific major versions for compatibility
 */
const VERSION_CONSTRAINTS: Record<string, string> = {
  "react-router": "^7.0.0", // Keep in v7
  fastify: "^5.0.0", // Keep in v5
  typescript: "^5.0.0", // Keep in v5
  vite: "^6.0.0", // Keep in v6
  prisma: "^6.0.0", // Keep in v6
  "@prisma/client": "^6.0.0", // Keep in v6
};

/**
 * Checks if a version satisfies the constraint
 */
function satisfiesConstraint(version: string, constraint: string): boolean {
  // Simple major version check - in production, you'd use semver
  const versionMajor = Number.parseInt(version.split(".")[0]);
  const constraintMajor = Number.parseInt(
    constraint.replace(/[\^~]/, "").split(".")[0]
  );

  return versionMajor === constraintMajor;
}

/**
 * Fetches latest versions for multiple packages with proper error handling
 */
export async function fetchLatestVersions(
  packages: string[],
  currentVersions: Record<string, string> = {},
  options: VersionFetchOptions = {}
): Promise<VersionInfo[]> {
  const results: VersionInfo[] = [];

  // Fetch versions concurrently
  const fetchPromises = packages.map(
    async (packageName): Promise<VersionInfo> => {
      const currentVersion = currentVersions[packageName] || "unknown";
      const latestVersion = await fetchPackageVersion(packageName, options);

      if (!latestVersion) {
        // Fallback to current version if fetch fails
        return {
          name: packageName,
          current: currentVersion,
          latest: currentVersion,
          updated: false,
        };
      }

      // Check version constraints
      const constraint = VERSION_CONSTRAINTS[packageName];
      const shouldUpdate = constraint
        ? satisfiesConstraint(latestVersion, constraint)
        : true;

      const finalVersion = shouldUpdate ? latestVersion : currentVersion;

      return {
        name: packageName,
        current: currentVersion,
        latest: latestVersion,
        updated: shouldUpdate && finalVersion !== currentVersion,
      };
    }
  );

  try {
    const fetchResults = await Promise.all(fetchPromises);
    results.push(...fetchResults);
  } catch (error) {
    console.log(
      chalk.yellow("⚠️  Some version checks failed, using template versions")
    );
  }

  return results;
}

/**
 * Extracts current versions from package.json content
 */
export function extractCurrentVersions(
  packageJsonContent: string
): Record<string, string> {
  try {
    const packageJson = JSON.parse(packageJsonContent);
    const versions: Record<string, string> = {};

    // Extract from dependencies and devDependencies
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === "string") {
        // Remove ^ ~ and other prefixes to get clean version
        versions[name] = version.replace(/^[\^~]/, "");
      }
    }

    return versions;
  } catch (error) {
    return {};
  }
}

/**
 * Updates package.json content with new versions
 */
export function updatePackageVersions(
  packageJsonContent: string,
  versionUpdates: VersionInfo[]
): string {
  try {
    const packageJson = JSON.parse(packageJsonContent);
    let updated = false;

    for (const update of versionUpdates) {
      if (!update.updated) continue;

      // Update in dependencies
      if (packageJson.dependencies?.[update.name]) {
        const currentValue = packageJson.dependencies[update.name];
        const prefix = currentValue.match(/^[\^~]/)?.[0] || "^";
        packageJson.dependencies[update.name] = `${prefix}${update.latest}`;
        updated = true;
      }

      // Update in devDependencies
      if (packageJson.devDependencies?.[update.name]) {
        const currentValue = packageJson.devDependencies[update.name];
        const prefix = currentValue.match(/^[\^~]/)?.[0] || "^";
        packageJson.devDependencies[update.name] = `${prefix}${update.latest}`;
        updated = true;
      }
    }

    return updated ? JSON.stringify(packageJson, null, 2) : packageJsonContent;
  } catch (error) {
    return packageJsonContent;
  }
}

/**
 * Displays version update summary to user
 */
export function displayVersionUpdates(versionUpdates: VersionInfo[]): void {
  const updates = versionUpdates.filter((v) => v.updated);

  if (updates.length === 0) {
    console.log(chalk.green("✅ All dependencies are up to date"));
    return;
  }

  console.log(chalk.blue("📦 Updated to latest versions:"));
  for (const update of updates) {
    console.log(
      chalk.blue(`   • ${update.name}: ${update.current} → ${update.latest}`)
    );
  }
  console.log(); // Extra spacing
}
