# create-fastify-react-router

The fastest way to create a modern fullstack application with **Fastify API** and **React Router 7** frontend in a monorepo setup.

## Quick Start

```bash
npx create-fastify-react-router my-app
cd my-app
pnpm dev
```

## What You Get

A production-ready monorepo with:

- **🚀 Fastify API** - High-performance Node.js backend with TypeScript
- **⚛️ React Router 7** - Modern React with SSR and file-based routing
- **🗄️ Database Ready** - Prisma ORM with SQLite (easily switch to PostgreSQL/MySQL)
- **🎨 Styled** - Tailwind CSS with responsive design
- **📦 Monorepo** - Turborepo with pnpm workspaces for scalability
- **🔧 Developer Tools** - Hot reload, TypeScript, Biome linting
- **📱 Working Example** - Complete Todo CRUD application

## CLI Options

```bash
npx create-fastify-react-router [project-name] [options]

Options:
  --db <database>     Database to use (sqlite, postgres, mysql) [default: sqlite]
  --orm <orm>         ORM to use (prisma, none) [default: prisma]
  --lint <linter>     Linter to use (biome, eslint) [default: biome]
  --no-install        Skip dependency installation
  --no-git            Skip git initialization
  -h, --help          Display help
```

## Examples

```bash
# Create with defaults (SQLite + Prisma + Biome)
npx create-fastify-react-router my-app

# Use PostgreSQL database
npx create-fastify-react-router my-app --db postgres

# Use ESLint instead of Biome
npx create-fastify-react-router my-app --lint eslint

# Skip automatic setup
npx create-fastify-react-router my-app --no-install --no-git
```

## After Generation

Your project will be created with this structure:

```
my-app/
├── apps/
│   ├── api/          # Fastify API server (localhost:3001)
│   └── web/          # React Router 7 app (localhost:5173)
├── packages/
│   ├── database/     # Shared Prisma database
│   ├── shared-utils/ # Shared utilities
│   └── ui/           # Shared UI components
└── package.json      # Root configuration
```

## Getting Started

1. **Install dependencies**:

   ```bash
   cd my-app
   pnpm install
   ```

2. **Set up database**:

   ```bash
   cp .env.example .env
   pnpm db:push
   ```

3. **Start development**:

   ```bash
   pnpm dev
   ```

4. **Open your app**:
   - Frontend: http://localhost:5173
   - API: http://localhost:3001
   - Database Studio: `pnpm db:studio`

## Database Options

### SQLite (Default)

- Zero configuration
- Perfect for development
- Database file stored in `data/dev.db`

### PostgreSQL

```bash
npx create-fastify-react-router my-app --db postgres
```

- Production-ready
- Requires PostgreSQL server
- Update `DATABASE_URL` in `.env`

### MySQL

```bash
npx create-fastify-react-router my-app --db mysql
```

- Popular choice
- Requires MySQL server
- Update `DATABASE_URL` in `.env`

## Need Help?

- 📖 [Full Documentation](https://github.com/jarodtaylor/fastify-react-router-starter)
- 🐛 [Report Issues](https://github.com/jarodtaylor/fastify-react-router-starter/issues)
- 💬 [Discussions](https://github.com/jarodtaylor/fastify-react-router-starter/discussions)

## What's Next?

After creating your project, you can:

- **Add Authentication** - JWT, OAuth, or session-based auth
- **Deploy** - Vercel, Railway, Docker, or traditional hosting
- **Scale** - Add more API apps or frontend apps to the monorepo
- **Customize** - Modify the Todo example or build your own features

---

**Happy coding!** 🎉 You're ready to build something amazing.
