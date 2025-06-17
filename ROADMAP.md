# 🗺️ Fastify Project Starter - Roadmap

> **Vision**: The go-to CLI for creating production-ready Fastify-based fullstack projects with multiple frontend framework options.

## 📊 **Current Status: Core CLI Complete - Template Expansion Phase**

✅ **CLI LAUNCHED!** The `create-fastify-project` CLI is now published on npm and fully functional with the React Router template.

**What's Working Now:**

```bash
npx create-fastify-project my-app
# Creates a full Fastify + React Router 7 + Prisma project
```

**Next Focus**: Expanding template options (Next.js, SolidJS, Svelte) and advanced features.

---

## ✅ **Completed (Phases 1 & 2)**

### **🏗️ Foundation & Multi-Template CLI**

- [x] **Basic CLI Structure** - Created working `create-fastify-project`
- [x] **React Router Template** - Complete Fastify + React Router 7 + Prisma + Turborepo stack
- [x] **Database Options** - SQLite (default), PostgreSQL, MySQL support
- [x] **ORM Integration** - Prisma with different database configurations
- [x] **Development Tooling** - Biome formatting, TypeScript, hot reload
- [x] **CLI Options** - `--db`, `--orm`, `--lint`, `--no-install`, `--no-git`

### **🔄 Repository Restructure (COMPLETED)**

- [x] **Repository Rename** - `fastify-react-router-starter` → `fastify-project-starter`
- [x] **CLI Rename** - `create-fastify-react-router` → `create-fastify-project`
- [x] **Package Scope Update** - `@fastify-react-router-starter` → `@fastify-project-starter`
- [x] **Directory Structure** - Created `packages/` and `templates/` directories
- [x] **CLI Migration** - Moved CLI from root `cli/` to `packages/create-fastify-project/`
- [x] **Template Extraction** - Moved current template to `templates/react-router/`
- [x] **CLI Package Rename** - Successfully published as `create-fastify-project@1.0.13`
- [x] **Template System** - CLI now works with template-based architecture
- [x] **Root Cleanup** - Clean workspace structure implemented
- [x] **Path Updates** - All internal references updated to new structure

### **📦 Package Management (COMPLETED)**

- [x] **Workspace Configuration** - Updated pnpm-workspace.yaml for new structure
- [x] **Dependencies** - Clean and organized package dependencies
- [x] **Build System** - Working Turbo configuration for new structure

### **🐛 Critical Fixes & Infrastructure**

- [x] **PostgreSQL Setup Issue** - Fixed CLI failing when PostgreSQL database not available
- [x] **Version Synchronization** - Fixed hardcoded version issues, now reads from package.json
- [x] **Biome Formatting** - Switched from tabs to spaces for ecosystem compatibility
- [x] **npm README** - Updated CLI README to be user-focused instead of developer-focused
- [x] **CI/CD Pipeline** - Robust formatting, linting, and validation checks
- [x] **Automated Publishing** - Reliable GitHub Actions workflow for npm publishing
- [x] **Precheck System** - `pnpm precheck` catches all CI issues locally before commits
- [ ] **Fix Template** - generated template has .env in the root of the monorepo and in the packages directory.
- [ ] **Update .gitignore** - Generated template has things in it that should be ignored by git:
  - `node_modules`
  - `.turbo/`
  - `apps/web/.react-router/`
  - `apps/web/node_modules/.vite/`

Also -- check about the template directory inside of the CLI -- is that supposed to be there or is it supposed to use the /template directory in the root of the project starter?

Postgres table doesn't exist? Also, should the table name be todo and not Todo? Or does that not matter?

| Schema | Name | Type  | Owner       |
| ------ | ---- | ----- | ----------- |
| public | Todo | table | jarodtaylor |

```
SELECT 1
Time: 0.020s
test*delete_later> SELECT * FROM Todo;
relation "todo" does not exist
```

### **📚 Documentation & Processes**

- [x] **Contributing Guidelines** - Clear separation of contributor vs maintainer workflows
- [x] **Development Documentation** - Comprehensive setup and testing guides
- [x] **Release Process** - Documented and automated release workflow
- [x] **Tool Version Management** - Mise integration for consistent dev/CI environments

---

## 🚧 **In Progress (Phase 3: Template Expansion)**

### **🚀 Next.js Template**

- [ ] **Template Creation** - Build Next.js + Fastify template
- [ ] **Template Testing** - Ensure Next.js template works with all database options
- [ ] **Documentation** - Next.js-specific setup and deployment guides

### **🔧 SolidJS Template**

- [ ] **Template Creation** - Build SolidJS + Fastify template
- [ ] **Template Testing** - Ensure SolidJS template works with all database options
- [ ] **Documentation** - SolidJS-specific setup and deployment guides

---

## 🎯 **Next Up (Phase 4: Advanced Templates)**

### **🌟 Additional Frontend Frameworks**

- [ ] **Svelte Template** - `--template svelte` for Svelte + Fastify
- [ ] **Vue Template** - `--template vue` for Vue + Fastify
- [ ] **Vanilla TypeScript** - `--template vanilla` for API-only projects

### **🔧 Template Enhancement Features**

- [ ] **CSS Framework Options** - `--css tailwind|styled-components|vanilla`
- [ ] **Authentication Options** - `--auth clerk|auth0|lucia|none`
- [ ] **Testing Setup** - `--testing vitest|jest|playwright`
- [ ] **Deployment Configs** - `--deploy vercel|railway|docker`

### **📖 Enhanced Documentation**

- [ ] **Template Comparison Guide** - Help users choose the right template
- [ ] **Migration Guides** - Moving between templates or upgrading
- [ ] **Best Practices** - Template-specific recommendations

---

## 🚀 **Future Templates (Phase 5: Expansion)**

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

## 🏗️ **Advanced Features (Phase 6: Polish)**

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

### **Immediate (Phase 3)**

1. **Next.js Template Creation** - Build Next.js + Fastify template from scratch
2. **SolidJS Template Creation** - Build SolidJS + Fastify template from scratch
3. **Template Documentation** - Framework-specific setup guides
4. **Template Testing** - Automated validation of all templates

### **Short Term (Phase 4)**

5. **Svelte Template** - Create Svelte + Fastify template
6. **Vue Template** - Create Vue + Fastify template
7. **Vanilla API Template** - API-only template for backend services
8. **Template Comparison Guide** - Help users choose the right template

### **Medium Term (Phase 5)**

9. **CSS Framework Options** - `--css tailwind|styled-components|vanilla`
10. **Authentication Integration** - `--auth clerk|auth0|lucia|none`
11. **Testing Setup Options** - `--testing vitest|jest|playwright`
12. **Deployment Configurations** - `--deploy vercel|railway|docker`

### **Long Term (Phase 6)**

13. **Interactive CLI Mode** - Guided setup with prompts and previews
14. **Advanced Build Options** - `--monorepo turborepo|nx|none`
15. **Analytics Integration** - Optional usage tracking and insights
16. **Template Marketplace** - Community template contributions system

---

## 🎯 **Success Metrics**

### **Short Term (3 months) - ✅ ACHIEVED**

- [x] CLI successfully renamed and published as `create-fastify-project`
- [x] React Router template working perfectly with new structure
- [x] All CI/CD pipelines green and reliable
- [x] Documentation comprehensive and user-friendly

### **Medium Term (6 months) - 🎯 CURRENT TARGETS**

- [ ] 3+ stable templates available (React Router ✅, Next.js, SolidJS)
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

**Next Session Priority**: Create Next.js and SolidJS templates to expand template options and achieve our medium-term success metrics.

## 🚀 **Ready for Next Development Session**

### **Current State Summary**

✅ **Fully Functional CLI**: `create-fastify-project@1.0.13` published and working
✅ **Robust Infrastructure**: CI/CD, formatting, linting, precheck system all working
✅ **Complete React Router Template**: Production-ready Fastify + React Router 7 + Prisma stack
✅ **Clean Architecture**: Multi-template system ready for expansion

### **Immediate Next Steps**

1. **Create Next.js Template** - Start with `templates/nextjs/` directory
2. **Create SolidJS Template** - Start with `templates/solidjs/` directory
3. **Update CLI Logic** - Enable template selection with `--template` flag
4. **Template Testing** - Ensure all templates work with database options

### **Key Technical Decisions Made**

- **Repository Structure**: `packages/` for CLI, `templates/` for project templates
- **CLI Package Name**: `create-fastify-project` (successfully published)
- **Template Approach**: Copy and customize living template projects
- **Database Support**: SQLite (default), PostgreSQL, MySQL with Prisma
- **Tooling**: Turborepo, pnpm, Biome formatting, TypeScript

The foundation is solid and ready for template expansion! 🎯
