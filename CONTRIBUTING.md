# Contributing to create-fastify-react-router

Thank you for your interest in contributing! This project consists of a **living template** and a **CLI generator** that creates new projects from that template.

## 🏗️ Project Structure

```
fastify-react-router-starter/
├── apps/                    # Template apps (API + Web)
├── packages/               # Template packages (database, utils, etc.)
├── cli/                    # CLI generator source code
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

# Install dependencies
pnpm install

# Set up database
cp .env.example .env
pnpm db:push

# Start development servers
pnpm dev
```

## 🧪 Testing the CLI

### Build and Test Locally

```bash
# Build the CLI
pnpm build:cli

# Test CLI generation (without install/git for speed)
cd /tmp
node /path/to/project/cli/dist/index.js test-project --no-install --no-git

# Test full CLI flow
node /path/to/project/cli/dist/index.js my-app
cd my-app && pnpm install && pnpm dev
```

### CLI Development Workflow

```bash
# Work on CLI in development mode
cd cli
pnpm dev test-project --no-install --no-git

# Build for testing
pnpm build

# Test specific CLI features
node dist/index.js test --db postgres --lint eslint
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

**How to test**:

1. Make changes to the template
2. Test the template itself: `pnpm dev`
3. Test CLI generation: `pnpm build:cli && test CLI`
4. Verify generated projects work correctly

### 2. CLI Enhancements

**What**: Improve the CLI generator itself (cli/ directory)

**Examples**:

- Add new CLI options
- Improve error handling
- Add interactive prompts
- Better variable replacement
- Support new template variants

**Files to modify**:

- `cli/src/index.ts` - Main CLI entry point
- `cli/src/create-project.ts` - Project creation logic
- `cli/src/utils/` - CLI utilities

**How to test**:

1. Build CLI: `cd cli && pnpm build`
2. Test generation: `node dist/index.js test-project`
3. Verify customization works
4. Test error cases

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
5. **Commit and push**: `git commit -m "Add amazing feature"`
6. **Open a Pull Request**

### Testing Checklist

Before submitting a PR, ensure:

- [ ] Template works: `pnpm dev` starts successfully
- [ ] CLI builds: `pnpm build:cli` succeeds
- [ ] CLI generates projects: Test with various options
- [ ] Generated projects work: Install deps and start dev servers
- [ ] Variable replacement works: Check package names/scopes
- [ ] Documentation is updated if needed

## 🎨 CLI Architecture

### Key Components

1. **Template Copying** (`copy-template.ts`)

   - Copies entire project excluding build artifacts
   - Handles file/directory exclusions
   - Preserves file permissions

2. **Variable Replacement** (`replace-vars.ts`)

   - Replaces project names and package scopes
   - Updates configuration files
   - Handles database-specific configs

3. **Project Creation** (`create-project.ts`)
   - Orchestrates the entire process
   - Handles dependency installation
   - Manages git initialization

### Adding New CLI Options

1. **Update CLI definition** in `src/index.ts`:

   ```typescript
   .option('--new-option <value>', 'Description', 'default')
   ```

2. **Update ProjectOptions interface** in `src/create-project.ts`:

   ```typescript
   export interface ProjectOptions {
     // ... existing options
     newOption: string;
   }
   ```

3. **Handle the option** in template generation:
   - Update `promptForOptions()` in `src/utils/prompts.ts`
   - Add logic in `copyTemplate()` or `replaceTemplateVars()`

### Template Variable System

Variables are replaced throughout the generated project:

- `fastify-react-router-starter` → `{projectName}`
- `@fastify-react-router-starter` → `@{projectName}`
- Author information → Placeholder values

To add new variables:

1. Define in `TEMPLATE_VARS` in `replace-vars.ts`
2. Add replacement logic in `generateReplacements()`
3. Update file processing if needed

## 🚀 Release Process

### CLI Releases

1. **Update version** in `cli/package.json`
2. **Build and test** thoroughly
3. **Update CHANGELOG** if we add one
4. **Tag release**: `git tag v1.x.x`
5. **Publish to npm**: `cd cli && npm publish`

### Template Updates

Template updates are automatically available since the CLI always uses the latest template from the repository.

## 📋 Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Biome (run `pnpm format`)
- **Linting**: Biome (run `pnpm lint`)
- **Naming**: camelCase for variables, PascalCase for types
- **Files**: kebab-case for file names

## 🐛 Debugging

### CLI Issues

```bash
# Enable debug logging (if we add it)
DEBUG=cli node cli/dist/index.js test-project

# Test with verbose npm
node cli/dist/index.js test-project --verbose
```

### Template Issues

```bash
# Check generated project
cd generated-project
pnpm install
pnpm typecheck
pnpm lint
pnpm build
```

## 🤝 Getting Help

- **Questions**: Open a [Discussion](https://github.com/jarodtaylor/fastify-react-router-starter/discussions)
- **Bugs**: Open an [Issue](https://github.com/jarodtaylor/fastify-react-router-starter/issues)
- **Features**: Open an [Issue](https://github.com/jarodtaylor/fastify-react-router-starter/issues) with feature request

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making this project better!** 🎉
