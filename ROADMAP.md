# 🗺️ Fastify Project Starter - Roadmap

> **Vision**: The go-to CLI for creating production-ready Fastify-based fullstack projects with multiple frontend framework options.

## 📊 **Current Status: Repository Restructure Phase**

We're transitioning from a single-template CLI (`create-fastify-react-router`) to a flexible multi-template system (`create-fastify-project`).

---

## ✅ **Completed (Phase 1)**

### **🏗️ Foundation & Initial CLI**

- [x] **Basic CLI Structure** - Created working `create-fastify-react-router`
- [x] **React Router Template** - Complete Fastify + React Router 7 + Prisma + Turborepo stack
- [x] **Database Options** - SQLite (default), PostgreSQL, MySQL support
- [x] **ORM Integration** - Prisma with different database configurations
- [x] **Development Tooling** - Biome formatting, TypeScript, hot reload
- [x] **CLI Options** - `--db`, `--orm`, `--lint`, `--no-install`, `--no-git`

### **🐛 Critical Fixes**

- [x] **PostgreSQL Setup Issue** - Fixed CLI failing when PostgreSQL database not available
- [x] **Version Synchronization** - Fixed hardcoded version issues, now reads from package.json
- [x] **Biome Formatting** - Switched from tabs to spaces for ecosystem compatibility
- [x] **npm README** - Updated CLI README to be user-focused instead of developer-focused

### **📚 Documentation & Processes**

- [x] **Contributing Guidelines** - Clear separation of contributor vs maintainer workflows
- [x] **Development Documentation** - Comprehensive setup and testing guides
- [x] **Automated Publishing** - GitHub Actions workflow for npm publishing on releases
- [x] **CI/CD Pipeline** - Formatting, linting, and validation checks

---

## 🚧 **In Progress (Phase 2: Restructure)**

### **🔄 Repository Restructure**

- [x] **Repository Rename** - `fastify-react-router-starter` → `fastify-project-starter`
- [x] **Directory Structure** - Created `packages/` and `templates/` directories
- [x] **CLI Migration** - Moved CLI from root `cli/` to `packages/cli/`
- [x] **Template Extraction** - Moved current template to `templates/react-router/`
- [ ] **CLI Package Rename** - Update from `create-fastify-react-router` to `create-fastify-project`
- [ ] **Template System** - Implement CLI logic to select and use templates
- [ ] **Root Cleanup** - Remove duplicate files, update workspace configuration
- [ ] **Path Updates** - Fix all internal references to new structure

### **📦 Package Management**

- [ ] **Workspace Configuration** - Update pnpm-workspace.yaml for new structure
- [ ] **Dependencies** - Clean up and reorganize package dependencies
- [ ] **Build System** - Update Turbo configuration for new structure

---

## 🎯 **Next Up (Phase 3: CLI Enhancement)**

### **🚀 Multi-Template CLI**

- [ ] **Template Selection Logic** - `npx create-fastify-project my-app --template react-router`
- [ ] **Default Template** - React Router as default when no template specified
- [ ] **Template Validation** - Ensure selected template exists and is valid
- [ ] **Help Documentation** - Update CLI help to show available templates

### **🔧 Template System Architecture**

- [ ] **Template Metadata** - Create template.json files with configuration
- [ ] **Variable Replacement** - Update system to work with template-specific variables
- [ ] **Template Discovery** - Auto-discover available templates from `templates/` directory
- [ ] **Template Validation** - Verify template structure and required files

### **📖 Documentation Updates**

- [ ] **README Overhaul** - Update root README for multi-template approach
- [ ] **CLI Documentation** - Update packages/cli/README.md with new usage
- [ ] **Template READMEs** - Create template-specific documentation
- [ ] **Migration Guide** - Help existing users transition from old CLI

---

## 🚀 **Future Templates (Phase 4: Expansion)**

### **Frontend Framework Templates**

- [ ] **Next.js Template** - `--template nextjs` for Next.js + Fastify
- [ ] **SolidJS Template** - `--template solidjs` for SolidJS + Fastify
- [ ] **Svelte Template** - `--template svelte` for Svelte + Fastify
- [ ] **Vue Template** - `--template vue` for Vue + Fastify
- [ ] **Vanilla TypeScript** - `--template vanilla` for API-only projects

### **Template Features**

- [ ] **CSS Framework Options** - `--css tailwind|styled-components|vanilla`
- [ ] **Authentication Options** - `--auth clerk|auth0|lucia|none`
- [ ] **Testing Setup** - `--testing vitest|jest|playwright`
- [ ] **Deployment Configs** - `--deploy vercel|railway|docker`

---

## 🏗️ **Advanced Features (Phase 5: Polish)**

### **🔧 Build System Options**

- [ ] **Monorepo Alternatives** - `--monorepo turborepo|nx|none`
- [ ] **Package Manager Choice** - `--package-manager pnpm|npm|yarn`
- [ ] **TypeScript Variants** - `--typescript strict|standard|none`

### **🎨 Interactive Setup**

- [ ] **Interactive Mode** - Guided setup with prompts when no options provided
- [ ] **Template Previews** - Show template descriptions and features
- [ ] **Dependency Analysis** - Show what will be installed before proceeding

### **📊 Analytics & Telemetry**

- [ ] **Usage Analytics** - Optional anonymous usage data collection
- [ ] **Popular Combinations** - Track most-used option combinations
- [ ] **Template Adoption** - Monitor which templates are most popular

---

## 🛠️ **Technical Debt & Improvements**

### **Code Quality**

- [ ] **CLI Testing** - Comprehensive test suite for CLI functionality
- [ ] **Template Testing** - Automated testing of generated projects
- [ ] **Error Handling** - Improve error messages and recovery instructions
- [ ] **Performance** - Optimize template copying and dependency installation

### **Developer Experience**

- [ ] **Local Development** - Improve CLI development workflow
- [ ] **Template Development** - Tools for creating and testing new templates
- [ ] **Documentation** - Auto-generate CLI help from code
- [ ] **Debugging** - Better logging and debug modes

### **Infrastructure**

- [ ] **Release Automation** - Fully automated releases with changelogs
- [ ] **Version Management** - Semantic versioning with automated bumps
- [ ] **Template Validation** - CI checks for template integrity
- [ ] **Breaking Change Detection** - Automated detection of breaking changes

---

## 📋 **GitHub Issues to Create**

### **Immediate (Phase 2)**

1. **CLI Package Rename** - Update package name and bin command
2. **Template System Implementation** - Core template selection logic
3. **Root Directory Cleanup** - Remove duplicate files and update configs
4. **Workspace Configuration** - Update pnpm-workspace.yaml

### **Short Term (Phase 3)**

5. **CLI Help Documentation** - Update help text and examples
6. **Template Metadata System** - Design and implement template.json
7. **Path Reference Updates** - Fix all internal path references
8. **Migration Documentation** - Guide for existing users

### **Medium Term (Phase 4)**

9. **Next.js Template** - Create Next.js + Fastify template
10. **SolidJS Template** - Create SolidJS + Fastify template
11. **Template Testing Framework** - Automated template validation
12. **Interactive CLI Mode** - Guided setup experience

### **Long Term (Phase 5)**

13. **Monorepo Options** - Support for different monorepo tools
14. **Advanced Template Features** - CSS, auth, testing options
15. **Analytics Integration** - Optional usage tracking
16. **Template Marketplace** - Community template contributions

---

## 🎯 **Success Metrics**

### **Short Term (3 months)**

- [ ] CLI successfully renamed and published as `create-fastify-project`
- [ ] React Router template working perfectly with new structure
- [ ] All CI/CD pipelines green and reliable
- [ ] Documentation comprehensive and user-friendly

### **Medium Term (6 months)**

- [ ] 3+ stable templates available (React Router, Next.js, SolidJS)
- [ ] 1000+ weekly npm downloads
- [ ] Active community contributing templates
- [ ] Zero critical issues in CLI

### **Long Term (12 months)**

- [ ] 5+ frontend framework templates
- [ ] 10,000+ weekly npm downloads
- [ ] Featured in Fastify ecosystem recommendations
- [ ] Community-driven template marketplace

---

## 💡 **Notes & Decisions**

### **Naming Decisions**

- **Repository**: `fastify-project-starter` (done)
- **CLI Package**: `create-fastify-project` (in progress)
- **Default Template**: `react-router` (decided)

### **Architecture Decisions**

- **Structure**: Separate `packages/` and `templates/` directories (decided)
- **Template Selection**: CLI flag `--template <name>` (decided)
- **Backward Compatibility**: Deprecate old package, no migration needed (decided)

### **Technical Decisions**

- **Monorepo Tool**: Continue with Turborepo (decided)
- **Package Manager**: Continue with pnpm (decided)
- **Template Engine**: Custom variable replacement (current, may revisit)

---

**Next Session Priority**: Complete Phase 2 restructure, then create GitHub issues for tracking.
