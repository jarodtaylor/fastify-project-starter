# Contributing to create-fastify-react-router

Thank you for your interest in contributing! This project consists of a **living template** and a **CLI generator** that creates new projects from that template.

## 🏗️ Project Structure

```
fastify-react-router-starter/
├── apps/                    # Template apps (API + Web)
├── packages/               # Template packages (database, utils, etc.)
├── cli/                    # CLI generator source code
│   ├── src/                # TypeScript source
│   ├── dist/               # Built JavaScript (gitignored)
│   ├── template/           # Generated template copy (gitignored)
│   ├── scripts/            # Build scripts
│   └── package.json        # CLI package config
├── DEVELOPMENT.md          # Development progress and architecture
└── CONTRIBUTING.md         # This file
```

## 🎯 How It Works

This project uses a **living template** approach:

1. **The template IS the project** - This entire repository serves as the template
2. **CLI copies and customizes** - The CLI copies this project and replaces variables
3. **Always up-to-date** - Template improvements automatically benefit the CLI

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/jarodtaylor/fastify-react-router-starter.git
cd fastify-react-router-starter

# Install dependencies for main project
pnpm install

# Install CLI dependencies
cd cli && pnpm install && cd ..

# Set up database
cp .env.example .env
pnpm db:push

# Start development servers (test the template)
pnpm dev
```

## 🔧 CLI Development Workflow

### Understanding the CLI Build Process

The CLI build involves two key steps:

1. **TypeScript Compilation**: `tsc` compiles `src/` to `dist/`
2. **Template Copying**: `copy-template.js` copies the main project to `cli/template/`

```bash
# Build CLI (runs both steps)
cd cli && pnpm build

# Build components separately
pnpm typecheck  # Check TypeScript
tsc            # Compile to dist/
pnpm copy-template  # Copy template files
```

### CLI Development Commands

```bash
# CLI directory commands
cd cli

# Development mode (TypeScript on-the-fly)
pnpm dev my-test-project --no-install --no-git

# Build and test locally
pnpm build
node dist/index.js test-project --no-install --no-git

# Test specific options
node dist/index.js test-project --db postgres --lint eslint --no-install

# Full test (with dependency installation)
node dist/index.js test-full --no-git
cd test-full && pnpm install && pnpm dev
```

### Template Copying System

The template copying excludes certain files/directories:

```javascript
// In cli/scripts/copy-template.js and cli/src/utils/copy-template.ts
const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  "cli", // Don't copy the CLI itself
  ".turbo",
  "data/", // Don't copy SQLite database files
  "dist",
  "build",
  ".next",
  ".react-router",
  "*.log",
  ".DS_Store",
];
```

**Critical**: The exclude pattern `"data/"` only excludes the `data` directory, not `database` packages. This was a major bug we fixed.

## 🧪 Testing the CLI

### Local Testing Workflow

```bash
# Quick test (no deps, no git)
cd cli && pnpm build
cd /tmp && node /path/to/cli/dist/index.js test-quick --no-install --no-git

# Check generated structure
ls test-quick/packages/  # Should include: database, shared-utils, typescript-config

# Full integration test
cd /tmp && node /path/to/cli/dist/index.js test-full
cd test-full && pnpm install && pnpm dev

# Test error handling
node /path/to/cli/dist/index.js existing-dir  # Should fail gracefully
```

### Testing Published CLI

```bash
# Test latest published version
npx create-fastify-react-router@latest test-published --no-install --no-git

# Test specific version
npx create-fastify-react-router@1.0.3 test-v103

# Compare local vs published
node cli/dist/index.js test-local --no-install
npx create-fastify-react-router test-published --no-install
diff -r test-local test-published
```

## 🐛 Debugging and Troubleshooting

### Common CLI Issues

**Issue**: Generated project missing packages

```bash
# Check template copying
ls cli/template/packages/  # Should include database package

# Check exclude patterns in both:
# - cli/scripts/copy-template.js
# - cli/src/utils/copy-template.ts
```

**Issue**: Variable replacement not working

```bash
# Check generated files
grep -r "fastify-react-router-starter" test-project/  # Should be minimal
grep -r "@test-project" test-project/  # Should find scoped packages
```

**Issue**: CLI validation failing

```bash
# Test validation logic
node -e "
const { validateProject } = require('./cli/dist/create-project.js');
validateProject('/path/to/test-project', { install: false, orm: 'prisma' })
  .then(hasErrors => console.log('Has errors:', hasErrors));
"
```

### CLI Error Messages

The CLI provides different error states:

- ✅ **Success**: Dependencies installed, database set up, validation passed
- ⚠️ **Partial Success**: Project created but needs manual setup
- ❌ **Failure**: Project creation failed

Debug error messaging in `cli/src/create-project.ts`:

```typescript
// Look for validation logic
async function validateProject(projectPath: string, options: ProjectOptions) {
  // Checks for node_modules existence
  // Checks for required packages
  // Returns true if errors found
}
```

### Database Setup Issues

```bash
# Manual database setup in generated project
cd generated-project
cp .env.example .env
npx prisma generate --schema=packages/database/prisma/schema.prisma
npx prisma db push --schema=packages/database/prisma/schema.prisma
```

### Template Development Issues

```bash
# Test template independently
pnpm install && pnpm dev  # Main project should work

# Check monorepo structure
pnpm --filter api dev      # Test API only
pnpm --filter web dev      # Test web only

# Database issues
pnpm db:reset             # Reset database
pnpm db:push              # Push schema changes
```

## 📝 Types of Contributions

### 1. Template Improvements

**What**: Improve the generated project template (apps/, packages/, configs)

**Examples**:

- Add new shared utilities
- Improve the Todo app example
- Update dependencies
- Add new package configurations
- Improve database schema

**Testing Process**:

1. Make changes to the template
2. Test template: `pnpm dev`
3. Build CLI: `cd cli && pnpm build`
4. Test CLI generation: `node dist/index.js test-project`
5. Test generated project: `cd test-project && pnpm install && pnpm dev`

### 2. CLI Enhancements

**What**: Improve the CLI generator itself (cli/ directory)

**Examples**:

- Add new CLI options
- Improve error handling
- Add interactive prompts
- Better variable replacement
- Support new template variants

**Key Files**:

- `cli/src/index.ts` - Main CLI entry, argument parsing
- `cli/src/create-project.ts` - Project creation orchestration
- `cli/src/utils/copy-template.ts` - Template copying logic
- `cli/src/utils/replace-vars.ts` - Variable replacement system
- `cli/src/utils/prompts.ts` - Interactive prompts
- `cli/src/utils/validation.ts` - Project name validation
- `cli/scripts/copy-template.js` - Build-time template copying

**Testing Process**:

1. Build CLI: `cd cli && pnpm build`
2. Test locally: `node dist/index.js test-project`
3. Test error cases: Invalid names, existing directories, etc.
4. Test all CLI options: `--db`, `--lint`, `--orm`, `--no-install`, etc.

### 3. Documentation

**What**: Improve documentation for users and contributors

**Examples**:

- Update README.md
- Improve CLI help text
- Add deployment guides
- Update DEVELOPMENT.md

## 🔄 Development Workflow

### Making Changes

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (template and/or CLI)
4. **Test thoroughly** (see testing sections above)
5. **Update version** if needed: `cli/package.json`
6. **Commit and push**: `git commit -m "feat: add amazing feature"`
7. **Open a Pull Request**

### Testing Checklist

Before submitting a PR, ensure:

- [ ] **Template works**: `pnpm dev` starts successfully
- [ ] **CLI builds**: `cd cli && pnpm build` succeeds
- [ ] **CLI generates projects**: Test with various options
- [ ] **Generated projects work**: `pnpm install && pnpm dev` succeeds
- [ ] **Variable replacement works**: Check package names/scopes in generated files
- [ ] **Database setup works**: Prisma generate/push succeeds in generated project
- [ ] **Error handling works**: Test `--no-install` shows proper instructions
- [ ] **Documentation updated**: If behavior changes

## 🚀 Publishing and Release Process

### Publishing CLI Updates

**Step 1: Prepare Release**

```bash
# Update version in cli/package.json
# Update DEVELOPMENT.md if needed
# Commit changes
git add . && git commit -m "feat: description of changes"
```

**Step 2: Build and Test**

```bash
cd cli && pnpm build

# Test locally first
node dist/index.js test-local --no-install --no-git
ls test-local/packages/  # Verify structure

# Full test
node dist/index.js test-full
cd test-full && pnpm install && pnpm dev  # Should work completely
```

**Step 3: Publish to npm**

```bash
cd cli && npm publish
# This publishes to https://www.npmjs.com/package/create-fastify-react-router
```

**Step 4: Test Published Version**

```bash
cd /tmp
npx create-fastify-react-router@latest test-published --no-install
ls test-published/packages/  # Verify it works
```

**Step 5: Push to Git**

```bash
git push origin main
# Optionally tag: git tag v1.x.x && git push --tags
```

### Version Strategy

- **Patch** (1.0.x): Bug fixes, small improvements
- **Minor** (1.x.0): New features, CLI options
- **Major** (x.0.0): Breaking changes, major refactors

### Release Notes

Document in DEVELOPMENT.md:

- What changed
- Breaking changes (if any)
- CLI improvements
- Template improvements

## 🎨 CLI Architecture Deep Dive

### Template Variable System

The CLI replaces these variables throughout the generated project:

```typescript
// In cli/src/utils/replace-vars.ts
const TEMPLATE_VARS = {
  "fastify-react-router-starter": projectName,
  "@fastify-react-router-starter": `@${projectName}`,
  AUTHOR_NAME: "Your Name",
  AUTHOR_EMAIL: "your.email@example.com",
  // Add more as needed
};
```

**Files processed**: `package.json`, `*.ts`, `*.tsx`, `*.md`, config files

### Project Validation Logic

```typescript
// In cli/src/create-project.ts
async function validateProject(projectPath: string, options: ProjectOptions) {
  // 1. Check if node_modules exists (dependencies installed)
  // 2. Check if required packages exist (database, shared-utils, etc.)
  // 3. Return true if any errors found
}
```

### Error Handling States

The CLI provides clear feedback:

```typescript
if (hasErrors) {
  // Show step-by-step instructions
  console.log("📦 Install dependencies: pnpm install");
  console.log("🗄️  Set up database: ...");
  console.log("❌ Setup incomplete");
} else {
  // Show success message
  console.log("✨ Project created successfully!");
}
```

### Adding New CLI Options

**1. Update CLI Definition** (`cli/src/index.ts`):

```typescript
.option('--new-option <value>', 'Description', 'default')
```

**2. Update Interface** (`cli/src/create-project.ts`):

```typescript
export interface ProjectOptions {
  newOption: string;
  // ... existing options
}
```

**3. Handle in Logic**:

- Add to `promptForOptions()` in `cli/src/utils/prompts.ts`
- Use in `copyTemplate()` or `replaceTemplateVars()`
- Add validation if needed

### Understanding Template Copying

**Build-time**: `cli/scripts/copy-template.js`

- Runs during `pnpm build`
- Copies main project to `cli/template/`
- Used for npm packaging

**Runtime**: `cli/src/utils/copy-template.ts`

- Runs when user executes CLI
- Copies from `cli/template/` to user's target directory
- Applies exclusions and filtering

## 📋 Code Style and Standards

- **TypeScript**: Strict mode enabled
- **Formatting**: Biome (run `pnpm format`)
- **Linting**: Biome (run `pnpm lint`)
- **Naming**: camelCase for variables, PascalCase for types
- **Files**: kebab-case for file names
- **Commits**: Conventional commits (feat:, fix:, docs:, etc.)

## 🤖 CI/CD and Automated Checks

### Pull Request Checks

Every PR automatically runs these checks:

**🔍 Pre-commit Checks**:

- Code formatting (Biome)
- Linting (TypeScript + Biome)
- Type checking (main project + CLI)
- Security scanning (no secrets, large files)

**🏗️ Template Validation**:

- TypeScript compilation
- Build process
- Database setup
- Runtime functionality (API + Web endpoints)

**🛠️ CLI Validation**:

- CLI builds successfully
- Template structure is correct
- CLI help/version commands work

**🚀 CLI Generation Testing**:

- Multiple test scenarios (default, no-install, postgres, eslint)
- Project structure validation
- Variable replacement verification
- Generated project compilation and build

**🎯 End-to-End Testing**:

- Full project generation with dependency installation
- Database setup and API functionality
- Runtime validation with real HTTP requests

**🔒 Security Checks**:

- Dependency vulnerability scanning
- Package audit (moderate+ severity issues fail)

**📚 Documentation Validation**:

- Link checking
- Documentation structure verification
- Version consistency checks

### Local Testing Commands

Run the same checks locally before pushing:

```bash
# Quick pre-commit checks
pnpm format:check && pnpm lint && pnpm typecheck

# Full template validation
pnpm build && pnpm dev  # Test in another terminal

# CLI validation
cd cli && pnpm build && node dist/index.js test-local --no-install --no-git

# Security checks
pnpm audit && cd cli && pnpm audit
```

### Continuous Monitoring

**📊 Scheduled Checks**:

- **Daily**: Published CLI testing across Node.js versions
- **Weekly**: Dependency update notifications

**🚨 Failure Handling**:

- PRs are blocked if any required check fails
- Security issues trigger immediate notifications
- Published CLI failures create warning issues

### Adding New Checks

To add new CI checks:

1. **Update workflow files** in `.github/workflows/`
2. **Add corresponding package.json scripts** if needed
3. **Document in CONTRIBUTING.md**
4. **Test locally first** to avoid CI failures

**Example**: Adding a new test suite:

```yaml
# In .github/workflows/ci.yml
- name: 🧪 New Test Suite
  run: pnpm test:new-feature
```

```json
// In package.json
"scripts": {
  "test:new-feature": "vitest run new-feature"
}
```

## 🤝 Getting Help

- **Questions**: Open a [Discussion](https://github.com/jarodtaylor/fastify-react-router-starter/discussions)
- **Bugs**: Open an [Issue](https://github.com/jarodtaylor/fastify-react-router-starter/issues)
- **Features**: Open an [Issue](https://github.com/jarodtaylor/fastify-react-router-starter/issues) with feature request
- **CLI Problems**: Include output of `node cli/dist/index.js --help` and steps to reproduce

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making this project better!** 🎉
