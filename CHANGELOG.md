# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2025-01-11

### Fixed

- Added missing `.env.example` file to database package template with SQLite/PostgreSQL/MySQL examples
- Fixed database workflow to copy `.env.example` from correct location (`packages/database/.env.example`)
- Resolved Prisma `DATABASE_URL` environment variable error during project creation
- Added `.cursorignore` to improve development tooling support for `.env.example` files

## [1.1.0] - 2025-01-11

### Added

- Interactive CLI prompts for missing options using `prompts` library
- Professional logger system with spinners, styled output, and progress indicators
- Dynamic package version fetching with `version-fetcher` utilities
- Smart version constraints respecting major version compatibility
- Enhanced Commander.js integration with `Option` API and proper validation
- Comprehensive error handling with graceful fallbacks
- Build timing and completion messages for better UX

### Changed

- **BREAKING**: Migrated build system from `tsc` to `tsup` bundler
- **BREAKING**: Reorganized directory structure (`commands/` → `workflows/`)
- Improved CLI output to match industry standards (create-next-app quality)
- Enhanced package.json with better scripts and dependencies
- Updated all GitHub Actions workflows for tsup compatibility
- Replaced ad-hoc `console.log` calls with unified logger system
- Improved error messages with actionable guidance

### Fixed

- Promise.all error handling replaced with Promise.allSettled for better resilience
- Inconsistent logging patterns standardized across codebase
- Import path issues and removed unnecessary `.js` extensions
- TypeScript configuration and build process optimization

### Performance

- Build time reduced from ~1-2 seconds to ~14ms
- Single 34KB bundled output instead of multiple files
- Faster CLI startup and execution
- More efficient package version fetching with concurrent requests

### Developer Experience

- Eliminated need for `.js` extensions in TypeScript imports
- Cleaner import paths and better code organization
- Enhanced error handling and debugging capabilities
- Improved development workflow with modern tooling

### Documentation

- Updated README with new features and usage examples
- Added comprehensive CONTRIBUTING.md with release workflow
- Enhanced inline code documentation and JSDoc comments

## [1.0.13] - 2025-06-17

### Fixed

- Minor bug fixes and stability improvements
- Template validation enhancements

## [1.0.0] - 2025-06-04

### Added

- Initial release of create-fastify-project CLI
- Fastify API + React Router 7 monorepo template
- Support for SQLite, PostgreSQL, and MySQL databases
- Prisma ORM integration
- Biome and ESLint linting options
- Turborepo monorepo configuration
- TypeScript support throughout
- Git initialization and dependency installation

[Unreleased]: https://github.com/jarodtaylor/fastify-project-starter/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/jarodtaylor/fastify-project-starter/compare/v1.0.13...v1.1.0
[1.0.13]: https://github.com/jarodtaylor/fastify-project-starter/compare/v1.0.0...v1.0.13
[1.0.0]: https://github.com/jarodtaylor/fastify-project-starter/releases/tag/v1.0.0
