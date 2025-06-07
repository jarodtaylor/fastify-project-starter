# Contributing to Fastify Project Starter

Welcome! This project consists of a **CLI generator** that creates fullstack applications with multiple template options.

## 🏗️ **Project Structure**

```
fastify-project-starter/
├── packages/
│   └── create-fastify-project/  # CLI generator source code
│       ├── src/                 # TypeScript source
│       ├── template/            # Generated template copy (gitignored)
│       └── scripts/             # Build scripts
├── templates/
│   ├── react-router/            # React Router 7 template (stable)
│   ├── nextjs/                  # Next.js template (coming soon)
│   └── solidjs/                 # SolidJS template (coming soon)
├── scripts/                     # Development and testing scripts
├── .github/workflows/           # CI/CD automation
├── ROADMAP.md                   # Project direction
└── README.md                    # User documentation
```

## 🎯 **How It Works**

This project uses a **living template** approach:

1. **Templates are real projects** - Each template in `templates/` is a fully functional project
2. **CLI copies and customizes** - The CLI copies templates and replaces variables
3. **Always up-to-date** - Template improvements automatically benefit the CLI

## 🛠️ **Development Setup**

### Prerequisites

- Node.js 18+ (preferably 20+)
- pnpm 10+
- Git

### Initial Setup

```bash
# Clone and install
git clone https://github.com/jarodtaylor/fastify-project-starter.git
cd fastify-project-starter
pnpm install

# Build CLI
cd packages/create-fastify-project && pnpm build && cd ../..
```

## 🔧 **Development Workflow**

### Testing Strategy

We use a **layered testing approach** focused on reliability:

#### 1. Template Testing (Primary)

Test templates directly - this is what users get:

```bash
# Test React Router template
cd templates/react-router
cp .env.example .env
cp packages/database/.env.example packages/database/.env
pnpm install
pnpm db:push
pnpm dev  # Should start API and web servers
```

#### 2. CLI Testing (Comprehensive Local Testing)

Test CLI generation locally before committing:

```bash
# Build CLI first
cd packages/create-fastify-project && pnpm build

# Test basic generation
node dist/index.js test-project --no-install --no-git
ls test-project/packages/  # Should see: database, shared-utils, typescript-config, ui

# Test with different options
node dist/index.js test-postgres --db postgres --no-install --no-git
node dist/index.js test-eslint --lint eslint --no-install --no-git

# Full integration test
node dist/index.js test-full
cd test-full && pnpm install && pnpm dev
```

#### 3. CI Validation (Fast Feedback)

CI focuses on code quality and basic functionality:

- Format/lint/type checking
- Template compilation and build
- CLI build validation
- Security audits

### Making Changes

#### Template Improvements

1. Make changes to templates in `templates/react-router/`
2. Test template: `cd templates/react-router && pnpm dev`
3. Build CLI: `cd packages/create-fastify-project && pnpm build`
4. Test CLI generation: `node dist/index.js test-project --no-install`
5. Verify generated project works: `cd test-project && pnpm install && pnpm dev`

#### CLI Enhancements

**Key Files:**

- `src/index.ts` - Main CLI entry, argument parsing
- `src/create-project.ts` - Project creation orchestration
- `src/utils/copy-template.ts` - Template copying logic
- `src/utils/replace-vars.ts` - Variable replacement system
- `src/utils/prompts.ts` - Interactive prompts
- `src/utils/validation.ts` - Project name validation

**Development Process:**

1. Make changes in `packages/create-fastify-project/src/`
2. Build CLI: `pnpm build`
3. Test locally: `node dist/index.js test-project`
4. Test error cases: Invalid names, existing directories, etc.

## 🧪 **Testing Guidelines**

### CLI Validation Testing

Test robustness with edge cases:

```bash
cd packages/create-fastify-project && pnpm build

# Test error handling - these should FAIL gracefully:
node dist/index.js test-project --db invalid-option     # Should show clear error
node dist/index.js existing-directory                   # Should detect existing dir
node dist/index.js ""                                   # Should prompt for name
node dist/index.js invalid@name                         # Should reject invalid chars

# Test successful generation with different combinations:
node dist/index.js test-sqlite --db sqlite --no-install --no-git
node dist/index.js test-postgres --db postgres --no-install --no-git
node dist/index.js test-eslint --lint eslint --no-install --no-git

# Clean up: rm -rf test-*
```

### Generated Project Validation

```bash
# Quick structure validation (no dependencies):
node dist/index.js test-quick --no-install --no-git
ls test-quick/packages/        # Should see required packages
grep -r "@test-quick" test-quick/  # Check variable replacement

# Full integration test:
node dist/index.js test-full
cd test-full
pnpm install                  # Should succeed
pnpm typecheck               # Should pass
pnpm dev                     # Should start both servers
```

## 📝 **Types of Contributions**

### 1. Template Improvements

**Examples:**

- Add new shared utilities
- Improve example applications
- Update dependencies
- Enhance database schemas
- Improve UI components

### 2. CLI Enhancements

**Examples:**

- Add new CLI options
- Improve error handling
- Add interactive prompts
- Better variable replacement
- Support new template variants

### 3. New Templates

**Requirements for new templates:**

- Must be fully functional standalone projects
- Include comprehensive README
- Follow TypeScript best practices
- Include proper package.json scripts
- Support all CLI database options
- Pass all validation checks

### 4. Documentation

- Update README for users
- Improve CLI help text
- Add deployment guides
- Update this contributing guide

## 🚀 **CLI Architecture**

### Template Variable System

```typescript
// In src/utils/replace-vars.ts
const TEMPLATE_VARS = {
  "react-router": projectName,
  "@react-router": `@${projectName}`,
  // Add more as needed
};
```

### Adding New CLI Options

1. **Update CLI Definition** (`src/index.ts`):

```typescript
.option('--new-option <value>', 'Description', 'default')
```

2. **Update Interface** (`src/create-project.ts`):

```typescript
export interface ProjectOptions {
  newOption: string;
  // ... existing options
}
```

3. **Handle in Logic**: Add to prompts, validation, and template processing

### Template Copying

**Build-time**: `scripts/copy-template.js`

- Runs during `pnpm build`
- Copies template to `template/` directory

**Runtime**: `src/utils/copy-template.ts`

- Runs when user executes CLI
- Applies exclusions and filtering

## 🤖 **CI/CD Process**

### Pull Request Checks

Every PR runs:

- 🔍 **Pre-commit checks**: Formatting, linting, type checking
- 🏗️ **Template validation**: Compilation, build, functionality
- 🛠️ **CLI validation**: Build success, template structure
- 🔒 **Security checks**: Dependency audits, vulnerability scanning

### Local Testing Commands

```bash
# Quick checks
pnpm format:check && pnpm lint && pnpm typecheck

# Template validation
cd templates/react-router && pnpm build && pnpm dev

# CLI validation
cd packages/create-fastify-project && pnpm build
node dist/index.js test-local --no-install --no-git
```

## 📋 **Code Standards**

- **TypeScript**: Strict mode enabled
- **Formatting**: Biome (run `pnpm format`)
- **Linting**: Biome (run `pnpm lint`)
- **Naming**: camelCase for variables, PascalCase for types
- **Files**: kebab-case for file names
- **Commits**: Conventional commits (feat:, fix:, docs:, etc.)

## 🔄 **Contributor Workflow**

### For External Contributors

1. **Fork and clone** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (template and/or CLI)
4. **Test thoroughly** using the guidelines above
5. **❌ Do NOT update versions** - maintainers handle versioning
6. **Commit and push**: `git commit -m "feat: add amazing feature"`
7. **Open Pull Request** - maintainers review and merge

> **📝 Note**: Contributors focus on features/fixes. Maintainers handle versioning, publishing, and releases.

### Testing Checklist

Before submitting a PR:

- [ ] **Template works**: `pnpm dev` starts successfully in template
- [ ] **CLI builds**: `cd packages/create-fastify-project && pnpm build` succeeds
- [ ] **CLI generates projects**: Test with various options
- [ ] **Generated projects work**: `pnpm install && pnpm dev` succeeds
- [ ] **Variable replacement works**: Check package names in generated files
- [ ] **Database setup works**: Prisma commands succeed
- [ ] **Error handling works**: Test invalid inputs
- [ ] **Documentation updated**: If behavior changes

## 🐛 **Debugging Common Issues**

### CLI Generation Issues

```bash
# Check template structure
ls packages/create-fastify-project/template/packages/

# Check exclude patterns in:
# - scripts/copy-template.js
# - src/utils/copy-template.ts

# Test variable replacement
grep -r "react-router" test-project/  # Should be minimal
```

### CI Failures

```bash
# Check formatting
pnpm format:check

# Check types
pnpm typecheck

# Check builds
cd templates/react-router && pnpm build
cd packages/create-fastify-project && pnpm build
```

## 🚀 **Release Process** (Maintainers Only)

> **👥 Contributors**: You don't handle releases! Submit PRs and maintainers take care of the rest.

**Automated Release Workflow:**

1. Merge contributor PRs
2. Update version: `cd packages/create-fastify-project && npm version patch`
3. Commit and push version bump
4. Create GitHub Release with tag `vX.Y.Z`
5. GitHub Actions automatically publishes to npm

## 🤝 **Getting Help**

- **Questions**: Open a [Discussion](https://github.com/jarodtaylor/fastify-project-starter/discussions)
- **Bugs**: Open an [Issue](https://github.com/jarodtaylor/fastify-project-starter/issues)
- **Features**: Open an [Issue](https://github.com/jarodtaylor/fastify-project-starter/issues) with feature request
- **CLI Problems**: Include output of CLI commands and steps to reproduce

## 📜 **License**

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making this project better!** 🎉
