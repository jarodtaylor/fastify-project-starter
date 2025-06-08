# Fastify React Router Starter

> Modern fullstack monorepo template with Fastify API, React Router 7 frontend, and TypeScript throughout.

A **production-ready starter** that gives you everything needed to build scalable fullstack applications. Built with modern tools and best practices.

## ✨ What's Included

### 🚀 **High-Performance API** (Fastify)

- TypeScript-first with full type safety
- 65k+ requests/sec capability (2x faster than Express)
- Built-in CORS, error handling, and validation
- Hot reload development experience

### ⚛️ **Modern React Frontend** (React Router 7)

- Server-side rendering (SSR) for SEO
- File-based routing with nested layouts
- Optimistic UI updates and form actions
- Responsive design with utility-first CSS

### 🗄️ **Database Ready** (Prisma ORM)

- SQLite for development, PostgreSQL/MySQL for production
- Type-safe database queries and migrations
- Visual database browser with Prisma Studio

### 📦 **Monorepo Architecture** (Turborepo)

- Shared packages for code reuse
- Optimized build caching and parallelization
- Independent app scaling and deployment

### 🔧 **Developer Experience**

- TypeScript everywhere with strict type checking
- Code formatting and linting (Biome)
- Hot reload for both frontend and backend
- Comprehensive tooling and scripts

## 🚀 Quick Start

### Option 1: Use the CLI (Recommended)

```bash
# Default setup (SQLite + Prisma + Biome)
npx create-fastify-project my-app
cd my-app
pnpm dev

# Or with PostgreSQL for production
npx create-fastify-project my-app --db postgres
cd my-app
# Add your DATABASE_URL to .env, then:
pnpm dev
```

> 💡 **See [CLI Options](#-cli-options) below for database, ORM, and linting customization**

### Option 2: Clone and Fork

```bash
git clone https://github.com/jarodtaylor/fastify-project-starter.git my-app
cd my-app
rm -rf .git && git init
pnpm install
cp .env.example .env
pnpm db:push
pnpm dev
```

**That's it!** Your fullstack application is running:

- 🌐 **Frontend**: http://localhost:5173
- 🚀 **API**: http://localhost:3000
- 🗄️ **Database Studio**: `pnpm db:studio`

## 📁 Project Structure

```
my-app/
├── apps/
│   ├── api/                 # Fastify API server
│   │   ├── src/
│   │   │   ├── index.ts         # Server entry point
│   │   │   └── routes/          # API endpoints
│   │   └── package.json
│   └── web/                 # React Router 7 frontend
│       ├── app/
│       │   ├── routes/          # File-based routing
│       │   ├── components/      # React components
│       │   └── root.tsx         # App shell
│       └── package.json
├── packages/
│   ├── database/            # Shared Prisma database
│   │   ├── prisma/schema.prisma # Database schema
│   │   └── src/index.ts         # Database utilities
│   ├── shared-utils/        # Shared utilities
│   ├── typescript-config/   # Shared TypeScript configs
│   └── ui/                  # Shared UI components
├── data/                    # SQLite database files
├── .env.example             # Environment variables template
├── package.json             # Root workspace config
├── turbo.json              # Monorepo build system
└── biome.json              # Code quality tools
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages for production
pnpm typecheck        # Run TypeScript checks
pnpm format           # Format code with Biome
pnpm lint             # Lint code

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open database browser
pnpm db:migrate       # Create and run migrations
pnpm db:reset         # Reset database with fresh data
```

### Adding Features

#### New API Endpoint

```typescript
// apps/api/src/routes/users.ts
import type { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/users", async () => {
    // Your logic here
    return { users: [] };
  });
};

export default users;
```

#### New Frontend Route

```tsx
// apps/web/app/routes/users.tsx
import type { Route } from "./+types/users";

export async function loader({ request }: Route.LoaderArgs) {
  // Fetch data from API
  const users = await fetch("/api/users").then((r) => r.json());
  return { users };
}

export default function Users({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Users</h1>
      {/* Your component here */}
    </div>
  );
}
```

#### Database Model

```prisma
// packages/database/prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

After adding models, run:

```bash
pnpm db:push  # Development
# or
pnpm db:migrate dev --name add-user-model  # Production
```

## 🗄️ Database Setup

### Development (SQLite - Default)

No setup required! Database file is created automatically at `data/dev.db`.

### Production (PostgreSQL)

1. **Get a PostgreSQL database** (Railway, Supabase, Neon, etc.)
2. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   ```
3. **Deploy schema**:
   ```bash
   pnpm db:push
   ```

### Production (MySQL)

1. **Get a MySQL database** (PlanetScale, AWS RDS, etc.)
2. **Update `.env`**:
   ```env
   DATABASE_URL="mysql://user:pass@host:3306/dbname"
   ```
3. **Deploy schema**:
   ```bash
   pnpm db:push
   ```

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

## 🎯 Use Cases

This starter is perfect for:

- **🏢 Business Applications** - CRM, admin panels, dashboards
- **💰 SaaS Products** - User authentication, billing, multi-tenancy ready
- **🛒 E-commerce** - Product catalogs, shopping carts, order management
- **📱 Social Apps** - User profiles, feeds, real-time features
- **📊 Analytics Dashboards** - Data visualization, reporting tools
- **🎓 Educational Platforms** - Course management, user progress tracking

## 🔧 CLI Options

The CLI provides flexible options to customize your project generation:

### Basic Usage

```bash
# Default setup (SQLite + Prisma + Biome)
npx create-fastify-project my-app

# Custom project name with options
npx create-fastify-project my-app [options]
```

### Available Options

| Option            | Values                        | Default  | Description                  |
| ----------------- | ----------------------------- | -------- | ---------------------------- |
| `--db <database>` | `sqlite`, `postgres`, `mysql` | `sqlite` | Database to use              |
| `--orm <orm>`     | `prisma`, `none`              | `prisma` | ORM/Database layer           |
| `--lint <linter>` | `biome`, `eslint`             | `biome`  | Code linting tool            |
| `--no-install`    | -                             | `false`  | Skip dependency installation |
| `--no-git`        | -                             | `false`  | Skip git initialization      |

### Examples

```bash
# PostgreSQL with Prisma (production-ready)
npx create-fastify-project my-app --db postgres

# MySQL with ESLint
npx create-fastify-project my-app --db mysql --lint eslint

# No database/ORM (API only)
npx create-fastify-project my-app --orm none

# Quick generation without dependencies
npx create-fastify-project my-app --no-install --no-git

# Full customization
npx create-fastify-project my-app --db postgres --lint eslint --no-git
```

### Database Configuration

**SQLite (Default)**

- ✅ Zero setup required
- ✅ Perfect for development
- ✅ Database file: `data/dev.db`

**PostgreSQL**

- 🚀 Production-ready
- 🔒 ACID compliant
- 📊 Advanced features
- 🔧 Requires DATABASE_URL

**MySQL**

- 🚀 Production-ready
- 🌐 Widely supported
- ⚡ High performance
- 🔧 Requires DATABASE_URL

### Post-Generation Setup

If you used `--no-install`, run these commands:

```bash
cd my-app
pnpm install
cp .env.example .env
pnpm db:push  # If using Prisma
pnpm dev
```

### Getting Help

```bash
# View all CLI options and help
npx create-fastify-project --help

# Check CLI version
npx create-fastify-project --version
```

## 🗺️ Coming Soon

- 🧪 **Automated CLI Testing** - Comprehensive test suite for CLI functionality and edge cases
- 🎨 **Tailwind CSS v4** - Modern styling with opt-out option
- 📁 **Examples Directory** - Authentication, CMS integration, testing setups
- 🔧 **More CLI Options** - Additional databases, ORMs, and styling solutions
- 📖 **Advanced Guides** - Deployment, scaling, and production best practices

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

This project uses a "living template" approach - improvements here benefit all generated projects.

## 📚 Learn More

- **[Fastify](https://fastify.dev/)** - Web framework for Node.js
- **[React Router](https://reactrouter.com/)** - Modern React routing
- **[Prisma](https://prisma.io/)** - Next-generation TypeScript ORM
- **[Turborepo](https://turbo.build/)** - High-performance build system

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to build something amazing?** 🚀

```bash
npx create-fastify-project my-app
cd my-app
pnpm dev
```
