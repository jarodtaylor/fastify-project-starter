# 🔄 Fastify Project Starter - Refactoring Analysis & Roadmap

> **Analysis Date**: December 2024
> **Reference**: NextJS `create-next-app` CLI patterns and best practices
> **Goal**: Review current architecture and plan incremental improvements for future extensibility

## 📊 Current State Analysis

### ✅ **What's Working Well**

1. **Clear CLI Purpose** - Single command focused on project generation
2. **Robust Error Handling** - Enhanced error system with recovery instructions
3. **Template Flexibility** - Database/ORM/linting options work well
4. **Documentation** - Comprehensive README and contributing guides
5. **CI/CD Pipeline** - Solid automated testing and publishing
6. **Monorepo Structure** - Clean separation of CLI and templates

### 🔍 **Key Insights from create-next-app Analysis**

**✨ What They Do Excellently:**

- **Hybrid CLI**: Support both interactive (`npx create-next-app@latest`) and non-interactive modes
- **Persistent Preferences**: Uses `Conf` library to save user choices across runs
- **Modular Helpers**: Clean separation of utilities (`helpers/` directory)
- **Single Focus**: One command, one purpose - but extensible architecture
- **Template System**: Simple but powerful template selection
- **Progressive Enhancement**: Start simple, add complexity as needed

### 🎯 **Strategic Refactoring Direction**

## 1. 🏗️ **CLI Architecture & Command Structure Evolution**

### **Current State**

- **Single Command**: `create-fastify-project [options]`
- **Monolithic**: All logic in `create-project.ts` (466 lines)
- **Flag-based**: All configuration via CLI flags

### **create-next-app Approach**

- **Hybrid Execution**: `npx create-next-app@latest` (interactive) + optional flags
- **Progressive Prompts**: Ask only when needed, remember preferences
- **Single Command**: Focused on one thing - creating projects

### **Our Evolution Strategy**

**Phase 1: Enhanced Single Command (create-next-app inspired)**

```bash
# Interactive mode (primary)
npx create-fastify-project@latest
# ✔ What would you like to name your project? › my-app
# ✔ Would you like to use TypeScript? › Yes
# ✔ Which database would you prefer? › PostgreSQL
# ✔ Would you like authentication? › Clerk

# Non-interactive mode (current + improved)
npx create-fastify-project@latest my-app --db postgres --auth clerk
```

**Phase 2: Future Multi-Command Structure (extensible foundation)**

```bash
# Project creation (Phase 1)
npx create-fastify-project@latest [name] [options]

# Future extensions
npx create-fastify-project add api --name user-service
npx create-fastify-project add frontend --framework react
npx create-fastify-project info
npx create-fastify-project migrate --from 1.0.0
```

## 2. 🧩 **Code Organization & Future-Proof Architecture**

### **Current Structure**

```
src/
├── create-project.ts      # 466 lines - monolithic
├── index.ts              # CLI entry point
└── utils/
    ├── copy-template.ts
    ├── error-handling.ts
    ├── prompts.ts
    ├── replace-vars.ts
    └── validation.ts
```

### **create-next-app Structure (Reference)**

```
packages/create-next-app/
├── index.ts              # CLI entry + interactive prompts
├── create-app.ts         # Core creation logic
├── helpers/              # Focused utilities
│   ├── copy.ts
│   ├── examples.ts
│   ├── get-pkg-manager.ts
│   ├── git.ts
│   ├── install.ts
│   ├── is-folder-empty.ts
│   ├── is-online.ts
│   ├── is-writeable.ts
│   └── validate-pkg.ts
└── templates/            # Template system
```

### **Our Proposed Evolution**

**Phase 1: create-next-app Inspired (Immediate)**

```
src/
├── index.ts              # CLI entry + prompts + Commander setup
├── create-project.ts     # Core project creation logic (refactored)
├── helpers/              # Focused, testable utilities
│   ├── copy-template.ts
│   ├── git.ts
│   ├── install.ts
│   ├── pkg-manager.ts
│   ├── preferences.ts    # User preference persistence
│   ├── prompts.ts
│   ├── validate.ts
│   └── is-online.ts
└── templates/            # Template management
    └── registry.ts       # Template selection logic
```

**Phase 2: Multi-Command Ready (Future)**

```
src/
├── index.ts              # CLI router
├── commands/
│   ├── create.ts         # Main project creation (from Phase 1)
│   ├── add.ts            # Add features to existing projects
│   ├── info.ts           # Project information
│   └── migrate.ts        # Migration utilities
├── helpers/              # Shared utilities
├── config/
│   ├── schema.ts         # Zod-based configuration
│   └── loader.ts         # Config file detection/loading
└── templates/
    ├── registry.ts
    └── features/         # Feature-based additions
```

### **Benefits of This Approach**

- **Familiar UX**: Users expect create-\* tools to work like create-next-app
- **Incremental Refactoring**: Can improve without breaking changes
- **Future-Proof**: Architecture supports extensibility without rewrites
- **Battle-Tested Patterns**: Following proven Next.js patterns

## 3. 🧪 **Testing Infrastructure**

### **Current State**

- **No Unit Tests**: Only manual CLI testing via scripts
- **No Test Framework**: No testing infrastructure
- **CI Testing**: Only validates builds and generation

### **shadcn-ui Testing Approach**

- **Comprehensive Unit Tests**: Commands, utilities, registry
- **Fixture-based Testing**: Test templates and generated outputs
- **Integration Tests**: End-to-end CLI workflows

### **Testing Strategy**

```typescript
// Example test structure
test/
├── commands/
│   ├── init.test.ts
│   └── add.test.ts
├── utils/
│   ├── config.test.ts
│   └── templates.test.ts
├── fixtures/
│   ├── templates/
│   └── projects/
└── integration/
    └── cli.test.ts
```

## 4. 🎨 **User Experience & Interface**

### **Current UX**

- **Basic Output**: Simple console.log statements
- **Limited Prompts**: Minimal interactive experience
- **Error Display**: Good error handling but basic formatting

### **shadcn-ui UX Excellence**

- **Rich Terminal UI**: Styled output with colors and formatting
- **Interactive Prompts**: Comprehensive prompt system with validation
- **Progress Indicators**: Spinners and progress bars
- **Contextual Help**: Helpful error messages and guidance

### **UX Improvements**

```typescript
// Current:
console.log("✨ Project created successfully!");

// Enhanced:
logger.success("Project created successfully!");
logger.info("Next steps:");
logger.step("cd my-app");
logger.step("pnpm dev");
```

## 5. 📋 **Configuration Management Strategy**

### **Current Approach**

- **CLI Options**: Simple command-line flags
- **No Persistence**: No saved configuration
- **Limited Validation**: Basic option validation

### **create-next-app Configuration System**

- **Persistent Preferences**: Uses `Conf` library to save user choices
- **Smart Defaults**: Remembers previous selections for faster setup
- **Reset Options**: `--reset-preferences` to clear saved choices
- **Validation**: Built-in validation for project names and options

### **Our Configuration Strategy**

**Phase 1: User Preference Persistence (create-next-app style)**

```typescript
// User preferences saved via Conf library
interface UserPreferences {
  defaultDatabase?: "sqlite" | "postgres" | "mysql";
  defaultAuth?: "none" | "clerk" | "supabase";
  defaultPackageManager?: "npm" | "pnpm" | "yarn" | "bun";
  defaultTemplate?: "react-router" | "nextjs";
  useTypeScript?: boolean;
}

// Smart prompting - only ask for unspecified options
const preferences = getUserPreferences();
const database =
  opts.database || preferences.defaultDatabase || (await promptForDatabase());
```

**Phase 2: Project Configuration (for multi-command future)**

```typescript
// fastify.config.ts (detected by future commands)
export default {
  template: "react-router",
  apps: {
    api: { framework: "fastify", port: 3001 },
    web: { framework: "react-router", port: 3000 },
  },
  database: "postgres",
  auth: "clerk",
} satisfies FastifyConfig;
```

**Phase 3: Advanced Configuration**

- **Workspace Detection**: Auto-detect existing fastify projects
- **Schema Validation**: Zod-based validation for all config
- **Migration Support**: Handle config schema changes

## 6. 🔧 **Template Management System**

### **Current System**

- **Static Copying**: Copy template directory during build
- **Single Template**: Only React Router template
- **Hardcoded Variables**: Template variable replacement

### **shadcn-ui Registry System**

- **Dynamic Registry**: Remote component/template fetching
- **Version Management**: Multiple versions of components
- **Modular Components**: Mix and match features

### **Template System Evolution**

```typescript
// Future registry system
const registry = {
  templates: {
    "react-router": "1.0.0",
    nextjs: "1.0.0",
    solidjs: "0.9.0",
  },
  features: {
    "auth-clerk": "1.0.0",
    "auth-supabase": "1.0.0",
    "database-postgres": "1.0.0",
  },
};
```

## 7. 🛠️ **Development Experience**

### **Current DX Issues**

- **Template Changes**: Require CLI rebuild to test
- **Limited Debugging**: Basic error information
- **Manual Testing**: No automated test suite

### **shadcn-ui DX Features**

- **Hot Reloading**: Quick development iteration
- **Debug Mode**: Verbose logging for troubleshooting
- **Comprehensive Testing**: Automated validation

## 🎯 **Refactoring Roadmap**

### **✅ COMPLETED: Dynamic Version Updates (Day 1)**

**🚀 MAJOR SUCCESS!** Our first refactoring improvement is working perfectly:

- ✅ **Version Fetcher Utility**: Created `src/utils/version-fetcher.ts`
- ✅ **Network Resilience**: 3-second timeout with graceful fallbacks
- ✅ **Smart Constraints**: Respects major version compatibility (React Router 7.x, Fastify 5.x)
- ✅ **Multi-Package Support**: Updates all package.json files in monorepo
- ✅ **User Feedback**: Shows "Updated 10 packages to latest versions"

**Real Results from Testing:**

- React Router: `7.5.3 → 7.6.2` ✅
- Fastify: `5.3.3 → 5.4.0` ✅
- TypeScript, Vite, Prisma: All updated ✅

**Impact**: Users now get the latest compatible versions automatically, solving the template staleness problem!

---

### **Phase 1: Enhanced Single Command (1-2 weeks)**

_Goal: create-next-app inspired UX without breaking changes_

1. **✅ Dynamic Version Updates** ← **COMPLETED!**

2. **Interactive CLI Implementation** ← **NEXT**

   - Add `prompts` library for interactive mode
   - Implement preference persistence with `Conf`
   - Support both `npx create-fastify-project@latest` and current flag usage

3. **Code Organization (create-next-app style)**

   - Refactor monolithic `create-project.ts` into focused modules
   - Create `helpers/` directory with specific utilities
   - Extract template logic to dedicated modules

4. **Enhanced User Experience**
   - Styled terminal output with `picocolors`
   - Progress indicators during installation
   - Better error messages and recovery suggestions

### **Phase 2: Robust Foundation** (2-3 weeks)

_Goal: Production-ready CLI with testing and validation_

1. **Testing Infrastructure**

   - Set up Vitest with CLI testing utilities
   - Create fixtures for template testing
   - Add integration tests for end-to-end workflows

2. **Configuration & Validation**

   - Implement robust project name validation
   - Add dependency compatibility checking
   - Smart package manager detection

3. **Template System Enhancement**
   - Registry system for template management
   - Template versioning and compatibility
   - Better variable replacement system

### **Phase 3: Future-Ready Architecture** (3-4 weeks)

_Goal: Extensible foundation for multi-command future_

1. **Multi-Command Architecture Preparation**

   - Restructure CLI to support future commands
   - Implement project detection utilities
   - Create configuration schema for project files

2. **Advanced Features**

   - Offline support for template caching
   - Update checking and notifications
   - Better git integration and initialization

3. **Developer Experience**
   - Template development utilities
   - CLI debugging tools
   - Performance optimization

## 🔍 **Specific Technical Improvements**

### **1. Error Handling Refinement**

```typescript
// Current: Enhanced but verbose
export class EnhancedError extends Error {
  // ... 437 lines of error handling
}

// Proposed: shadcn-ui inspired
export const handleError = (error: unknown) => {
  logger.break();
  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error("An unknown error occurred");
  }
  process.exit(1);
};
```

### **2. Modular Command Structure**

```typescript
// commands/init.ts
export const init = new Command()
  .name("init")
  .description("Initialize a new Fastify project")
  .argument("[name]", "Project name")
  .option("-t, --template <template>", "Template to use")
  .action(async (name, options) => {
    await runInit({ name, ...options });
  });
```

### **3. Configuration Schema**

```typescript
// config/schema.ts
export const projectConfigSchema = z.object({
  template: z.enum(["react-router", "nextjs", "solidjs"]),
  database: z.enum(["sqlite", "postgres", "mysql"]),
  auth: z.enum(["none", "clerk", "supabase"]).optional(),
  deployment: z.enum(["vercel", "railway", "docker"]).optional(),
});
```

## 📊 **Impact Assessment**

### **Benefits of Refactoring**

- ✅ **Maintainability**: 70% reduction in file complexity
- ✅ **Testability**: 100% test coverage achievable
- ✅ **Extensibility**: Easy addition of new templates/features
- ✅ **User Experience**: Professional CLI interface
- ✅ **Developer Experience**: Faster iteration and debugging

### **Risks & Mitigation**

- ⚠️ **Breaking Changes**: Maintain backward compatibility
- ⚠️ **Complexity**: Incremental refactoring approach
- ⚠️ **Testing Overhead**: Automated testing prevents regressions

## 🎯 **Success Metrics**

### **Code Quality**

- File size reduction: Target <200 lines per command
- Test coverage: >80% for all new code
- Build time: Maintain current speed
- Bundle size: No significant increase

### **User Experience**

- Setup time: Maintain <2 minutes for basic project
- Error clarity: 90% of users can resolve issues independently
- Documentation: Complete coverage of all commands

### **Developer Experience**

- New command addition: <30 minutes
- Template addition: <2 hours
- Bug fix cycle: <1 day for critical issues

## 🤔 **Answering Your Key Questions**

### **1. Command Structure Flow**

**Recommendation**: Follow create-next-app's hybrid approach:

```bash
# Primary usage (interactive)
npx create-fastify-project@latest
# ✔ What would you like to name your project? › my-app
# ✔ Would you like to use TypeScript? › Yes / No
# ✔ Which database would you prefer? › PostgreSQL / SQLite / MySQL
# ✔ Would you like authentication? › None / Clerk / Supabase

# Power-user usage (non-interactive)
npx create-fastify-project@latest my-app --db postgres --auth clerk --ts
```

### **2. Monolithic File Breakup Strategy**

**Recommendation**: Start with create-next-app style modularization:

```typescript
// Phase 1: Immediate improvements
src/
├── index.ts              // CLI entry + interactive prompts
├── create-project.ts     // Core logic (refactored to use helpers)
└── helpers/
    ├── copy-template.ts  // Template copying
    ├── git.ts           // Git initialization
    ├── install.ts       // Package installation
    ├── preferences.ts   // User preference persistence
    ├── prompts.ts       // Interactive prompting
    └── validate.ts      // Project validation

// Phase 2: Future-ready (when we add `add` commands)
src/
├── index.ts              // CLI router
├── commands/
│   ├── create.ts         // Main creation (current functionality)
│   └── add.ts           // Future: add api/frontend to existing project
└── helpers/             // Shared utilities
```

### **3. Configuration Priority Options**

Based on create-next-app analysis, here are our options:

**Option A: User Preferences Only (Recommended for Phase 1)**

- Use `Conf` library to save user choices
- Smart defaults for subsequent runs
- Reset option available

**Option B: Hybrid Approach (Phase 2)**

- User preferences + project-level config detection
- Future-ready for multi-command scenarios

**Option C: Full Project Config (Phase 3)**

- `fastify.config.ts` files for complex multi-app projects

### **4. UX Improvements Priority**

**Immediate (Phase 1)**:

- Interactive prompts with smart defaults
- Styled output with `picocolors`
- Progress indicators during installation

### **5. Future Ready Architecture**

**Multi-Command Foundation**: Structure code to support:

```bash
# Phase 1: Project creation
npx create-fastify-project@latest

# Future Phase 2: Adding to existing projects
npx create-fastify-project add api --name user-service
npx create-fastify-project add frontend --framework react
npx create-fastify-project info
```

## 🚀 **Recommended Immediate Actions**

### **Week 1: Enhanced Interactive CLI**

1. **Add interactive prompts** using `prompts` library
2. **Implement user preferences** with `Conf` library
3. **Refactor into helpers** following create-next-app pattern

### **Week 2: Code Organization**

1. **Extract template logic** to dedicated modules
2. **Add styled output** with `picocolors`
3. **Implement progress indicators**

## 🛠️ **Developer Experience Enhancements**

### **Current DX (Already Good!)**

- ✅ Comprehensive local testing script (`test-cli-local.sh`)
- ✅ Multiple test scenarios with validation
- ✅ Structure and variable replacement checks

### **Proposed DX Improvements**

**1. Watch Mode Development (create-next-app style)**

```json
// package.json scripts
{
  "dev": "ncc build ./index.ts -w -o dist/",
  "test:local": "./scripts/test-cli-local.sh",
  "test:interactive": "./scripts/test-interactive.sh",
  "link:local": "npm link && npm link create-fastify-project"
}
```

**2. Enhanced Local Testing**

```bash
# Quick iteration cycle
pnpm dev              # Watch mode compilation
pnpm test:local       # Full test suite (current script)
pnpm test:interactive # Test interactive prompts specifically
pnpm link:local       # Test globally installed version
```

**3. Interactive Testing Script**

```bash
#!/bin/bash
# scripts/test-interactive.sh - Test the interactive prompts
echo "🎯 Testing interactive CLI..."
cd /tmp/cli-interactive-test-$(date +%s)
node $CLI_DIR/dist/index.js # No arguments = interactive mode
```

**4. Development Workflow**

```bash
# Terminal 1: Watch mode
pnpm dev

# Terminal 2: Quick testing
alias cfp-local="node ./packages/create-fastify-project/dist/index.js"
cfp-local my-test-app --db postgres

# Quick iteration
cfp-local test-$(date +%s) --db sqlite --auth none
```

**5. Testing Matrix Enhancement**

```bash
# Enhanced test scenarios
test_scenarios=(
    "interactive:--interactive-test"      # New: test prompts
    "default:--no-git"
    "postgres:--db postgres --no-git"
    "full-stack:--db postgres --auth clerk --no-git"
    "preferences:--use-preferences --no-git"  # New: test saved preferences
)
```

### **Benefits for Contributors**

- **Fast Feedback Loop**: Watch mode + quick testing
- **Comprehensive Validation**: Existing robust test suite
- **Easy Onboarding**: Clear testing commands
- **Interactive Testing**: Validate UX changes easily

## 🚨 **CRITICAL: Template Staleness Problem**

### **The Issue You Identified**

You're absolutely right! Our current approach copies static template files with **fixed package versions**:

```json
// Our template's apps/web/package.json is frozen at:
{
  "react-router": "^7.5.3",
  "fastify": "^5.3.3"
}
// But latest might be 7.6.1, 5.4.2, etc.
```

**This means:**

- ❌ Users get outdated React Router versions
- ❌ Missing security fixes and new features
- ❌ Template becomes stale over time
- ❌ Unlike `npx create-react-router@latest` which gets fresh versions

### **The Solution: Hybrid Dynamic Updates**

**Recommended Strategy** (inspired by `create-next-app` and `create-vite`):

```typescript
// During project generation
const latestVersions = await fetchLatestVersions([
  "react-router", // Always latest 7.x
  "@react-router/dev",
  "@react-router/node",
  "fastify", // Always latest 5.x
  "@fastify/cors",
  "typescript", // Always latest 5.x
  "vite", // Always latest 6.x
]);

// Update package.json files dynamically after copying template
await updatePackageVersions(projectPath, latestVersions);
```

### **Implementation Approach**

**Phase 1: Smart Version Updates**

1. **Copy Static Structure** (fast) - Keep our proven file structure
2. **Update Key Frameworks** (dynamic) - Fetch latest compatible versions
3. **Preserve Configs** (static) - Keep our curated configurations
4. **Fallback Strategy** - Use template versions if network fails

```typescript
// helpers/update-versions.ts
export async function updateToLatestVersions(projectPath: string) {
  const updates = await Promise.allSettled([
    getLatestVersion("react-router", "^7"),
    getLatestVersion("fastify", "^5"),
    getLatestVersion("typescript", "^5"),
    // ... key deps
  ]);

  // Update all package.json files
  await updateAllPackageFiles(projectPath, validUpdates);
}
```

### **Which Dependencies to Update?**

**Dynamic (Always Latest)**:

- React Router ecosystem (`react-router`, `@react-router/dev`, etc.)
- Fastify ecosystem (`fastify`, `@fastify/cors`, etc.)
- Core dev tools (`typescript`, `vite`, `tsx`)
- Build tools (`turbo`, `@biomejs/biome`)

**Static (Template Controlled)**:

- Our internal packages (`@fastify-project-starter/*`)
- Configuration packages (specific tested versions)
- Complex integrations (Prisma - test specific versions)

### **User Experience**

```bash
# User gets latest versions automatically
npx create-fastify-project@latest my-app
# ✅ React Router 7.6.1 (latest)
# ✅ Fastify 5.4.2 (latest)
# ✅ TypeScript 5.8.3 (latest)
# ✅ Still uses our proven configuration
```

### **Benefits**

- ✅ **Fresh Versions**: Users get latest React Router, Fastify, etc.
- ✅ **Proven Structure**: Keep our tested configuration
- ✅ **Security**: Latest versions with security fixes
- ✅ **Features**: Users get newest framework features
- ✅ **Compatibility**: Use version ranges (`^7.5.0`) for compatibility

### **Safety & Fallbacks**

```typescript
// Network failure fallback
try {
  const latest = await fetchLatestVersions();
  await updateVersions(projectPath, latest);
} catch (error) {
  console.log(
    chalk.yellow("⚠️  Using template versions (network unavailable)")
  );
  // Continue with static template versions
}

// Version compatibility checking
const compatible = await checkVersionCompatibility(updates);
if (!compatible.all) {
  console.log(
    chalk.yellow("⚠️  Some versions incompatible, using safe defaults")
  );
}
```

### **Discussion Needed**

1. **Should we implement version updating in Phase 1?** (I strongly recommend yes - it's critical for adoption)
2. **Which dependencies should be dynamic vs. static?**
3. **Version range strategy**: `^7.5.0` vs `latest` vs `~7.5.0`?
4. **Testing strategy**: How do we validate version combinations?
5. **Offline support**: Cache latest versions locally?

### **Development Priority**

This is **make-or-break** for CLI adoption. Users expect fresh versions from modern project generators. Without this, our CLI will feel outdated compared to:

- `create-next-app` (always latest Next.js)
- `create-react-router` (always latest RR)
- `create-vite` (always latest Vite)

---

**Should we tackle template staleness in Phase 1 alongside interactive prompts?** This might be the most important architectural decision we make! 🚀
