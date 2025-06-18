# 🚀 Enhanced CLI with Modern Build System

> **Major release with significant performance and UX improvements**

## ✨ **What's New**

### **🎯 Interactive CLI Experience**

```bash
# New: Interactive mode with professional prompts
npx create-fastify-project

# Existing: All CLI options still work exactly the same
npx create-fastify-project my-app --db postgres --orm prisma
```

### **⚡ Performance Boost**

- **10x faster builds**: 14ms (was ~1-2 seconds)
- **Smaller bundle**: Single 34KB file
- **Faster startup**: Improved CLI responsiveness

### **🎨 Professional Output**

- Beautiful progress indicators and spinners
- Color-coded success/error messages
- Clear completion summaries
- Industry-standard UX (matches create-next-app)

## 🔧 **For Developers**

### **Modern Build System**

- Migrated to `tsup` bundler for better performance
- Cleaner TypeScript imports (no more `.js` extensions)
- Enhanced error handling and debugging

### **Improved Reliability**

- Better package version fetching with fallbacks
- Graceful handling of network issues
- More resilient error recovery

## 📦 **Getting Started**

```bash
# Create a new project
npx create-fastify-project@latest my-awesome-app

# Or use interactive mode
npx create-fastify-project@latest
```

## 📚 **Full Details**

For complete technical details, breaking changes, and migration information, see our [CHANGELOG.md](https://github.com/jarodtaylor/fastify-project-starter/blob/main/CHANGELOG.md).

## 🔗 **Links**

- **📦 npm**: [create-fastify-project](https://www.npmjs.com/package/create-fastify-project)
- **📖 Docs**: [README](https://github.com/jarodtaylor/fastify-project-starter/blob/main/packages/create-fastify-project/README.md)
- **🤝 Contributing**: [CONTRIBUTING.md](https://github.com/jarodtaylor/fastify-project-starter/blob/main/CONTRIBUTING.md)

---

**Full backward compatibility maintained** - all existing CLI usage continues to work exactly as before.
