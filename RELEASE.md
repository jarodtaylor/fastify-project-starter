# Release Process

This document outlines the automated release and publishing process for the `create-fastify-project` CLI.

## 🎯 **Overview**

We use **GitHub Releases** to trigger automated npm publishing. When you create a release with a version tag, GitHub Actions automatically builds, tests, and publishes the CLI to npm.

## 📋 **Release Checklist**

### **Prerequisites (One-Time Setup)**

1. **NPM_TOKEN Secret**: Ensure `NPM_TOKEN` is configured in GitHub repository secrets

   - Go to: Repository Settings → Secrets → Actions
   - Should contain an npm automation token with publish permissions

2. **Mise (Optional)**: For consistent local development with CI
   - Install: `curl https://mise.run | sh` or see [mise.jdx.dev](https://mise.jdx.dev)
   - Use: `mise install` to get the same Node.js/pnpm versions as CI

### **Release Steps**

1. **Update CLI Version**

   ```bash
   cd packages/create-fastify-project
   npm version patch  # or minor/major
   ```

2. **Fix Formatting** (npm version can mess up formatting)

   ```bash
   cd ../..  # back to root
   pnpm format
   ```

3. **Verify Locally**

   ```bash
   pnpm format:check && pnpm lint && pnpm typecheck
   cd packages/create-fastify-project && pnpm build
   node dist/index.js --version  # should show new version
   ```

4. **Commit Version Bump**

   ```bash
   git add packages/create-fastify-project/package.json
   git commit -m "chore: bump CLI version to X.Y.Z"
   git push
   ```

5. **Wait for CI** to pass (verify at GitHub Actions tab)

6. **Create GitHub Release**

   - Go to: https://github.com/jarodtaylor/fastify-project-starter/releases
   - Click "Draft a new release"
   - **Tag**: `vX.Y.Z` (must exactly match package.json version!)
   - **Title**: `vX.Y.Z`
   - **Description**: Release notes (see template below)
   - Click "Publish release"

7. **Monitor Automated Publishing**

   - Watch: https://github.com/jarodtaylor/fastify-project-starter/actions
   - Verify: https://www.npmjs.com/package/create-fastify-project

8. **Test Published Version**
   ```bash
   # Wait 1-2 minutes for npm propagation
   npx create-fastify-project@latest --version
   npx create-fastify-project@X.Y.Z test-release --no-install --no-git
   ```

## 📝 **Release Notes Template**

```markdown
## What's Changed

### 🚀 **Features**

- New feature descriptions

### 🐛 **Bug Fixes**

- Bug fix descriptions

### 🏗️ **Infrastructure**

- Infrastructure changes

### 📚 **Documentation**

- Documentation updates

**Full Changelog**: https://github.com/jarodtaylor/fastify-project-starter/compare/vPREV...vCURR
```

## 🔧 **Automated Workflow Details**

The `.github/workflows/publish.yml` workflow automatically:

1. ✅ **Validates** tag version matches package.json version
2. ✅ **Installs** dependencies and builds CLI
3. ✅ **Tests** CLI functionality (version command + project generation)
4. ✅ **Publishes** to npm using `NPM_TOKEN` secret
5. ✅ **Verifies** successful publication

## 🚨 **Troubleshooting**

### **Version Mismatch Error**

```
❌ Version mismatch: Git tag is v1.2.3 but CLI package.json is 1.2.4
```

**Fix**: Ensure the git tag exactly matches the version in `packages/create-fastify-project/package.json`

### **Formatting Failures**

```
❌ File content differs from formatting output
```

**Fix**: Run `pnpm format` after `npm version` and commit the changes

### **NPM_TOKEN Issues**

```
❌ 401 Unauthorized - Your token has not been granted the required scopes
```

**Fix**:

1. Generate new npm token: https://www.npmjs.com/settings/tokens
2. Ensure it has "Automation" type and "Publish" permission
3. Update GitHub secret: Repository Settings → Secrets → Actions → NPM_TOKEN

### **pnpm Version Mismatch**

```
❌ Multiple versions of pnpm specified:
  - version 10 in the GitHub Action config with the key "version"
  - version pnpm@10.11.1 in the package.json with the key "packageManager"
```

**Fix**: Remove `version:` specification from GitHub Actions workflows. The pnpm action will auto-detect from `package.json`'s `packageManager` field.

### **CI Failures Before Release**

- Always ensure CI passes before creating release
- Run local checks: `pnpm format:check && pnpm lint && pnpm typecheck`
- Check GitHub Actions tab for specific error details

## 📊 **Version Strategy**

- **Patch** (1.0.x): Bug fixes, small improvements, documentation
- **Minor** (1.x.0): New features, CLI options, template improvements
- **Major** (x.0.0): Breaking changes, major refactors

## 🎯 **Post-Release**

After successful release:

1. **Verify npm**: `npm view create-fastify-project version`
2. **Test CLI**: `npx create-fastify-project@latest test-new-release`
3. **Update ROADMAP.md** if needed
4. **Announce** in discussions/social media if significant

---

**Questions?** Open a discussion or check the GitHub Actions logs for detailed error information.
