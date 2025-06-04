# Development Guide

This guide is for developers who want to contribute to the Fastify React Router Starter.

## Architecture Overview

This project consists of:

- **Template**: The main starter template (root directory)
- **CLI**: Code generation tool (`cli/` directory)
- **Documentation**: Contributing guides and examples

## Development Workflow

### Prerequisites

- Node.js 18+ (preferably 20+)
- pnpm 10+
- Git

### Getting Started

```bash
# Clone and install
git clone <repo-url>
cd fastify-react-router-starter
pnpm install

# Install CLI dependencies
cd cli && pnpm install && cd ..
```

### Testing Strategy

We use a **layered testing approach** focused on reliability:

#### 1. Template Testing (Primary)

Test the template directly - this is what users get:

```bash
# Quick template validation
pnpm typecheck && pnpm build && pnpm format:check

# Full template test with database
cp .env.example .env
cp packages/database/.env.example packages/database/.env
pnpm db:push
pnpm dev  # Test locally
```

#### 2. CLI Testing (Comprehensive Local Testing)

Test CLI generation locally before committing:

```bash
# Run full CLI test suite
./scripts/test-cli-local.sh

# This tests all scenarios:
# - Default generation
# - Different database options
# - Different linting options
# - No-install option
```

#### 3. CI Validation (Simple & Fast)

CI focuses on fast feedback:

- Format/lint/type checking
- Template functionality
- CLI build validation
- Security audits

### Making Changes

#### Template Changes

1. Make your changes to the template
2. Test template functionality: `pnpm dev`
3. Run template validation: `pnpm typecheck && pnpm build`
4. Test CLI generation: `./scripts/test-cli-local.sh`
5. Commit changes

#### CLI Changes

1. Make changes in `cli/src/`
2. Build CLI: `cd cli && pnpm build`
3. Test CLI: `./scripts/test-cli-local.sh`
4. Update CLI template: `cd cli && pnpm copy-template`
5. Commit changes

### Package Management

**Critical: Keep pnpm versions aligned**

- Project specifies `"packageManager": "pnpm@10.11.1"`
- All workflows use pnpm version 10
- Local development should use pnpm 10+

### Common Tasks

```bash
# Template development
pnpm dev              # Start development servers
pnpm build            # Test build process
pnpm format           # Fix formatting
pnpm typecheck        # Check types

# CLI development
cd cli
pnpm build            # Build CLI
pnpm copy-template    # Update CLI template
node dist/index.js my-test --no-git  # Test CLI

# Testing
./scripts/test-cli-local.sh  # Full CLI validation
```

### Debugging

#### CLI Issues

- Use `./scripts/test-cli-local.sh` for comprehensive local testing
- Check CLI template sync: `cd cli && pnpm copy-template`
- Test CLI help: `cd cli && node dist/index.js --help`

#### Template Issues

- Test template directly: `pnpm dev`
- Check database setup: `pnpm db:push`
- Validate types: `pnpm typecheck`

### CI/CD

Our CI is designed for **reliability and speed**:

#### What CI Tests

✅ **Template validation** - Template builds and runs
✅ **Code quality** - Formatting, linting, type checking  
✅ **CLI building** - CLI compiles and basic functionality
✅ **Security** - Dependency audits
✅ **Documentation** - Link checking

#### What CI Doesn't Test

❌ **CLI project generation** - Too fragile in CI environments
❌ **Full end-to-end flows** - Better tested locally

#### Local Testing Philosophy

- **If it works locally, it works for users**
- **CI validates code quality and template integrity**
- **Comprehensive CLI testing happens locally before commit**

### Performance Considerations

- **Template startup time**: Keep dependencies minimal
- **CLI generation speed**: Optimize file copying and template processing
- **Build time**: Monitor bundle sizes and build performance

### Release Process

1. Test locally: `./scripts/test-cli-local.sh`
2. Update version in `cli/package.json`
3. Create PR with changes
4. After merge, tag release
5. Publish CLI to npm

### Best Practices

#### Template Development

- Keep the template minimal but functional
- Test with real development workflow
- Document any special setup requirements
- Ensure all package.json scripts work

#### CLI Development

- Test all option combinations
- Provide helpful error messages
- Validate user input thoroughly
- Keep CLI logic simple and predictable

#### Code Quality

- Use TypeScript strictly
- Follow existing code patterns
- Write descriptive commit messages
- Test edge cases locally

### Troubleshooting

#### "pnpm lockfile compatibility errors"

- Ensure using pnpm 10+: `pnpm --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

#### "Template variables not replaced"

- Check `cli/src/utils/replace-vars.ts`
- Ensure template copying: `cd cli && pnpm copy-template`

#### "Database connection issues"

- Check `.env` files exist and are valid
- Verify database URL format
- Run `pnpm db:push` to sync schema

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and code standards.
