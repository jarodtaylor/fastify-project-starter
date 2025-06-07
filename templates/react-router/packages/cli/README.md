# Create Fastify React Router

> 🚀 **CLI tool to generate modern fullstack applications with Fastify API + React Router 7 frontend**

A production-ready starter that scaffolds everything you need to build scalable fullstack applications. Built with TypeScript, modern tooling, and best practices.

## ✨ Quick Start

```bash
# Create a new project
npx create-fastify-react-router my-app
cd my-app
pnpm dev
```

**That's it!** Your fullstack application is running:

- 🌐 **Frontend**: http://localhost:5173
- 🚀 **API**: http://localhost:3000
- 🗄️ **Database Studio**: `pnpm db:studio`

## 🛠️ CLI Options

### Database Options

```bash
# SQLite (default - zero setup)
npx create-fastify-react-router my-app

# PostgreSQL (production-ready)
npx create-fastify-react-router my-app --db postgres

# MySQL
npx create-fastify-react-router my-app --db mysql
```

### Development Options

```bash
# Skip dependency installation (faster generation)
npx create-fastify-react-router my-app --no-install

# Skip git initialization
npx create-fastify-react-router my-app --no-git

# Use ESLint instead of Biome
npx create-fastify-react-router my-app --lint eslint

# Combine options
npx create-fastify-react-router my-app --db postgres --lint eslint --no-git
```

### All Available Options

| Option            | Values                        | Default  | Description                  |
| ----------------- | ----------------------------- | -------- | ---------------------------- |
| `--db <database>` | `sqlite`, `postgres`, `mysql` | `sqlite` | Database to use              |
| `--orm <orm>`     | `prisma`, `none`              | `prisma` | ORM/Database layer           |
| `--lint <linter>` | `biome`, `eslint`             | `biome`  | Code linting tool            |
| `--no-install`    | -                             | `false`  | Skip dependency installation |
| `--no-git`        | -                             | `false`  | Skip git initialization      |

## 📁 What You Get

Your generated project includes:

### 🚀 **High-Performance API** (Fastify)

- TypeScript-first with full type safety
- 65k+ requests/sec capability (2x faster than Express)
- Built-in CORS, error handling, and validation
- Hot reload development experience

### ⚛️ **Modern React Frontend** (React Router 7)

- Server-side rendering (SSR) for SEO
- File-based routing with nested layouts
- Optimistic UI updates and form actions
- Responsive design ready

### 🗄️ **Database Ready** (Prisma ORM)

- SQLite for development, PostgreSQL/MySQL for production
- Type-safe database queries and migrations
- Visual database browser with Prisma Studio

### 📦 **Monorepo Architecture** (Turborepo)

- Shared packages for code reuse
- Optimized build caching and parallelization
- Independent app scaling and deployment

## 🏗️ Project Structure

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

## 🚀 Getting Started

### 1. Generate Project

```bash
npx create-fastify-react-router my-app
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

## 📊 Available Scripts

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

## 🎯 Perfect For

- **🏢 Business Applications** - CRM, admin panels, dashboards
- **💰 SaaS Products** - User authentication, billing, multi-tenancy ready
- **🛒 E-commerce** - Product catalogs, shopping carts, order management
- **📱 Social Apps** - User profiles, feeds, real-time features
- **📊 Analytics Dashboards** - Data visualization, reporting tools

## 🗄️ Database Setup

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

## 🚀 Deployment

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

## 🔧 Troubleshooting

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

## 📚 Learn More

- **[Fastify Documentation](https://fastify.dev/)** - Web framework for Node.js
- **[React Router Documentation](https://reactrouter.com/)** - Modern React routing
- **[Prisma Documentation](https://prisma.io/)** - Next-generation TypeScript ORM
- **[Turborepo Documentation](https://turbo.build/)** - High-performance build system

## 🤝 Need Help?

- 📖 **[Full Documentation](https://github.com/jarodtaylor/fastify-react-router-starter)**
- 🐛 **[Report Issues](https://github.com/jarodtaylor/fastify-react-router-starter/issues)**
- 💬 **[Discussions](https://github.com/jarodtaylor/fastify-react-router-starter/discussions)**

## 📄 License

MIT License - see [LICENSE](https://github.com/jarodtaylor/fastify-react-router-starter/blob/main/LICENSE) for details.

---

**Ready to build something amazing?** 🚀

```bash
npx create-fastify-react-router my-app
cd my-app
pnpm dev
```
