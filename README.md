# Fastify Project Starter

> 🚀 **CLI tool to generate production-ready Fastify-based fullstack projects with multiple frontend framework options**

A flexible project generator that creates modern, scalable fullstack applications with Fastify APIs and your choice of frontend framework. Built with TypeScript, modern tooling, and industry best practices.

## ✨ Quick Start

```bash
# Create a React Router project (default)
npx create-fastify-project my-app
cd my-app
pnpm dev
```

**That's it!** Your fullstack application is running:

- 🌐 **Frontend**: http://localhost:5173
- 🚀 **API**: http://localhost:3000
- 🗄️ **Database Studio**: `pnpm db:studio`

## 🎯 **Available Templates**

| Template       | Description                                 | Status             |
| -------------- | ------------------------------------------- | ------------------ |
| `react-router` | React Router 7 + SSR + File-based routing   | ✅ **Stable**      |
| `nextjs`       | Next.js + App Router + Server Components    | 🚧 **Coming Soon** |
| `solidjs`      | SolidJS + SolidStart + Islands Architecture | 🚧 **Coming Soon** |
| `svelte`       | Svelte + SvelteKit + Server-side rendering  | 🚧 **Coming Soon** |

```bash
# Use specific template (when available)
npx create-fastify-project my-app --template react-router
npx create-fastify-project my-app --template nextjs
npx create-fastify-project my-app --template solidjs
```

## 🛠️ **CLI Options**

All templates support these customization options:

```bash
# Database options
npx create-fastify-project my-app --db postgres
npx create-fastify-project my-app --db mysql
npx create-fastify-project my-app --db sqlite  # default

# Development options
npx create-fastify-project my-app --lint eslint
npx create-fastify-project my-app --no-install
npx create-fastify-project my-app --no-git

# Combine options
npx create-fastify-project my-app --template react-router --db postgres --lint eslint
```

## 📁 **What You Get**

Every generated project includes:

### 🚀 **High-Performance API** (Fastify)

- TypeScript-first with full type safety
- 65k+ requests/sec capability (2x faster than Express)
- Built-in CORS, error handling, and validation
- Hot reload development experience

### ⚛️ **Modern Frontend** (Template-Specific)

- **React Router**: SSR, file-based routing, optimistic UI
- **Next.js**: App Router, Server Components, streaming
- **SolidJS**: Fine-grained reactivity, minimal runtime
- **Svelte**: Compiled components, optimal performance

### 🗄️ **Database Ready** (Prisma ORM)

- SQLite for development, PostgreSQL/MySQL for production
- Type-safe queries with auto-generated types
- Visual database browser with Prisma Studio
- Migration system for schema evolution

### 📦 **Monorepo Architecture** (Turborepo)

- Shared packages for code reuse across apps
- Optimized build caching and parallelization
- Independent scaling and deployment strategies

## 📊 **Project Structure**

```
my-app/
├── apps/
│   ├── api/                 # Fastify API server
│   └── web/                 # React Router 7 frontend
├── packages/
│   ├── database/            # Shared Prisma database
│   ├── shared-utils/        # Shared utilities
│   ├── typescript-config/   # Shared TypeScript configs
│   └── ui/                  # Shared UI components
├── .env.example             # Environment variables template
├── package.json             # Root workspace config
└── turbo.json              # Monorepo build system
```

## 🚀 **Getting Started**

### 1. Generate Project

```bash
npx create-fastify-project my-app
cd my-app
```

### 2. Environment Setup

If using PostgreSQL or MySQL:

```bash
# Copy environment template
cp .env.example .env

# Add your database URL
echo 'DATABASE_URL="postgresql://user:pass@host:5432/dbname"' >> .env
```

### 3. Start Development

```bash
# Install dependencies (if you used --no-install)
pnpm install

# Set up database
pnpm db:push

# Start all development servers
pnpm dev
```

## 📊 **Available Scripts**

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages for production
pnpm typecheck        # Run TypeScript checks

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open database browser
pnpm db:migrate       # Create and run migrations

# Code Quality
pnpm format           # Format code with Biome/ESLint
pnpm lint             # Lint code
```

## 🗄️ **Database Setup**

### SQLite (Default)

- ✅ **Zero setup required** - works out of the box
- ✅ **Perfect for development** and small applications
- 📁 **Database file**: `data/dev.db`

### PostgreSQL (Recommended for Production)

- 🚀 **Production-ready** with ACID compliance
- 🔒 **Advanced features** - JSON columns, full-text search
- 🌐 **Hosted options**: Railway, Supabase, Neon, Vercel Postgres

### MySQL

- 🚀 **Production-ready** with wide ecosystem support
- ⚡ **High performance** for read-heavy workloads
- 🌐 **Hosted options**: PlanetScale, AWS RDS, DigitalOcean

## 🚀 **Deployment**

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
# Add DATABASE_URL in Vercel dashboard
```

### Railway

```bash
npm i -g @railway/cli
railway login && railway init && railway up
```

### Docker

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## 🎯 **Perfect For**

- **🏢 Business Applications** - CRM, admin panels, dashboards
- **💰 SaaS Products** - User authentication, billing, multi-tenancy ready
- **🛒 E-commerce** - Product catalogs, shopping carts, order management
- **📱 Social Apps** - User profiles, feeds, real-time features
- **📊 Analytics Dashboards** - Data visualization, reporting tools

## 🔧 **Troubleshooting**

### PostgreSQL Setup Issues

If you see database connection errors:

```bash
# 1. Ensure your database is running
# 2. Check your DATABASE_URL in .env
# 3. Try manual setup:
cd packages/database
cp .env.example .env
# Edit .env with your DATABASE_URL
pnpm prisma generate
pnpm prisma db push
```

### Dependencies Installation

If dependencies fail to install:

```bash
# Clear package manager cache
pnpm store prune
rm -rf node_modules
pnpm install
```

## 📚 **Learn More**

### **Framework Documentation**

- **[Fastify](https://fastify.dev/)** - Web framework for Node.js
- **[React Router](https://reactrouter.com/)** - Modern React routing
- **[Prisma](https://prisma.io/)** - Next-generation TypeScript ORM
- **[Turborepo](https://turbo.build/)** - High-performance build system

### **Project Resources**

- **[Roadmap](./ROADMAP.md)** - Project direction and upcoming features
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute templates and improvements
- 🐛 **[Report Issues](https://github.com/jarodtaylor/fastify-project-starter/issues)**
- 💬 **[Discussions](https://github.com/jarodtaylor/fastify-project-starter/discussions)**

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to build something amazing?** 🚀

```bash
npx create-fastify-project my-app
cd my-app
pnpm dev
```
