# create-fastify-react-router

> A powerful CLI generator for modern fullstack monorepo applications with Fastify API and React Router 7 frontend.

**⚡ Production-ready in 60 seconds** - Complete fullstack application with database, authentication-ready structure, and modern tooling.

## Quick Start

```bash
npx create-fastify-react-router my-app
cd my-app
pnpm dev
```

**That's it!** You'll have a complete fullstack application running:

- 🚀 **API Server**: http://localhost:3000
- 🌐 **Frontend**: http://localhost:5173
- 🗄️ **Database**: SQLite with sample data

## Why Choose This Starter?

- **🏎️ Performance First** - Fastify is 2x faster than Express
- **🧩 Modern Architecture** - Monorepo with shared packages
- **🗄️ Database Flexible** - SQLite, PostgreSQL, or MySQL with zero config
- **📱 SSR Ready** - React Router 7 with server-side rendering
- **🔧 Developer Experience** - TypeScript, hot reload, linting, formatting
- **🚀 Deploy Anywhere** - Vercel, Railway, Docker, or traditional hosting

## CLI Options & Examples

### Basic Usage

```bash
npx create-fastify-react-router my-app
```

### Database Options

```bash
# SQLite (default) - Zero configuration
npx create-fastify-react-router my-app

# PostgreSQL - Production ready
npx create-fastify-react-router my-app --db postgres

# MySQL - Enterprise ready
npx create-fastify-react-router my-app --db mysql
```

### Development Preferences

```bash
# Use ESLint instead of Biome
npx create-fastify-react-router my-app --lint eslint

# Skip dependencies (manual install)
npx create-fastify-react-router my-app --no-install

# Skip git initialization
npx create-fastify-react-router my-app --no-git

# Combine options
npx create-fastify-react-router my-app --db postgres --lint eslint
```

### All CLI Options

```bash
npx create-fastify-react-router [project-name] [options]

Arguments:
  project-name              Name of your project

Options:
  --db <database>          Database (sqlite, postgres, mysql) [default: sqlite]
  --orm <orm>              ORM (prisma, none) [default: prisma]
  --lint <linter>          Linter (biome, eslint) [default: biome]
  --no-install             Skip dependency installation
  --no-git                 Skip git repository initialization
  -h, --help               Display help information
  -V, --version            Show version number
```

## What Gets Generated

### Complete Fullstack Monorepo

```
my-app/
├── apps/
│   ├── api/              # Fastify API server
│   │   ├── src/
│   │   │   ├── index.ts      # Server entry point
│   │   │   └── routes/       # API routes
│   │   └── package.json
│   └── web/              # React Router 7 frontend
│       ├── app/
│       │   ├── routes/       # File-based routing
│       │   └── components/   # React components
│       └── package.json
├── packages/
│   ├── database/         # Shared Prisma database
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   ├── shared-utils/     # Shared utilities
│   ├── typescript-config/ # Shared TypeScript configs
│   └── ui/               # Shared UI components
├── data/                 # SQLite database files (if using SQLite)
├── package.json          # Root workspace configuration
├── turbo.json           # Turborepo orchestration
├── biome.json           # Code formatting & linting
└── README.md            # Your project documentation
```

### Backend Features (Fastify API)

- **⚡ High Performance** - 65k+ requests/sec capability
- **🔒 Type Safety** - Full TypeScript integration
- **🗄️ Database Integration** - Prisma ORM with migrations
- **🌐 CORS Configuration** - Ready for frontend integration
- **📊 Error Handling** - Structured error responses
- **🔄 Hot Reload** - Instant development feedback
- **📝 Sample CRUD API** - Complete Todo implementation

### Frontend Features (React Router 7)

- **🚀 Server-Side Rendering** - SEO optimized
- **📁 File-Based Routing** - Intuitive URL structure
- **🎨 Tailwind CSS** - Utility-first styling
- **📱 Responsive Design** - Mobile-first approach
- **⚡ Optimistic UI** - Instant user feedback
- **🔄 Form Actions** - Built-in form handling
- **💾 Data Loading** - Efficient data fetching

## Database Configuration Guide

### SQLite (Recommended for Development)

**✅ Pros**: Zero configuration, portable, perfect for development
**🎯 Use Case**: Local development, prototyping, small applications

```bash
npx create-fastify-react-router my-app --db sqlite
```

**No additional setup required!** Database file created at `data/dev.db`.

### PostgreSQL (Recommended for Production)

**✅ Pros**: Robust, scalable, excellent for production
**🎯 Use Case**: Production applications, complex queries, high concurrency

```bash
npx create-fastify-react-router my-app --db postgres
```

**Setup PostgreSQL:**

1. **Install PostgreSQL** locally or use a service (Railway, Supabase, etc.)
2. **Create database**: `createdb myapp_dev`
3. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/myapp_dev"
   ```
4. **Run migrations**: `cd packages/database && pnpm prisma db push`

### MySQL (Enterprise Ready)

**✅ Pros**: Mature, widely supported, excellent tooling
**🎯 Use Case**: Enterprise applications, existing MySQL infrastructure

```bash
npx create-fastify-react-router my-app --db mysql
```

**Setup MySQL:**

1. **Install MySQL** locally or use a service (PlanetScale, AWS RDS, etc.)
2. **Create database**: `CREATE DATABASE myapp_dev;`
3. **Update `.env`**:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/myapp_dev"
   ```
4. **Run migrations**: `cd packages/database && pnpm prisma db push`

## Development Workflow

### Getting Started

```bash
# Generate your project
npx create-fastify-react-router my-awesome-app
cd my-awesome-app

# Start development servers
pnpm dev
```

### Available Scripts

```bash
pnpm dev              # Start all development servers
pnpm build            # Build all packages for production
pnpm typecheck        # Run TypeScript checks
pnpm lint             # Lint all code
pnpm format           # Format all code
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Create and run migrations
```

### Working with the Database

```bash
# View your data
cd packages/database
pnpm prisma studio

# Reset database
pnpm prisma db push --force-reset

# Create migration
pnpm prisma migrate dev --name add-user-model
```

### Adding New Features

1. **API Routes** - Add files to `apps/api/src/routes/`
2. **Frontend Pages** - Add files to `apps/web/app/routes/`
3. **Database Models** - Edit `packages/database/prisma/schema.prisma`
4. **Shared Components** - Add to `packages/ui/src/`
5. **Utilities** - Add to `packages/shared-utils/src/`

## Deployment Guide

### Vercel (Recommended)

**✅ Zero-config deployment with automatic SSL**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# DATABASE_URL=your_production_database_url
```

### Railway

**✅ Includes managed PostgreSQL database**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy with database
railway login
railway init
railway up
```

### Docker

**✅ Containerized deployment**

```dockerfile
# Dockerfile included in generated project
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Traditional VPS

**✅ PM2 or systemd deployment**

```bash
# Build for production
pnpm build

# Start with PM2
pm2 start ecosystem.config.js

# Or with systemd
sudo systemctl start my-app
```

## Troubleshooting

### Common Issues

**❓ Dependencies not installing**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
```

**❓ Database connection errors**

```bash
# Check your DATABASE_URL in .env
# Ensure database server is running
# Run: pnpm prisma db push
```

**❓ TypeScript errors**

```bash
# Regenerate Prisma client
cd packages/database
pnpm prisma generate

# Check types
pnpm typecheck
```

**❓ Port conflicts**

```bash
# API runs on :3000, Web on :5173
# Kill existing processes:
curl http://localhost:3000/api/todos
lsof -ti:3000 | xargs kill
```

### Getting Help

- 🐛 [Report Bugs](https://github.com/jarodtaylor/test-final-audit/issues)
- 💡 [Request Features](https://github.com/jarodtaylor/test-final-audit/issues)
- 💬 [Discussions](https://github.com/jarodtaylor/test-final-audit/discussions)
- 📖 [Wiki](https://github.com/jarodtaylor/test-final-audit/wiki)

## Migration Guide

### From Express.js

- Routes work similarly - replace `app.get()` with `fastify.get()`
- Middleware becomes plugins
- TypeScript support is built-in

### From Next.js

- File-based routing works the same way
- Replace `getServerSideProps` with React Router 7 loaders
- API routes move to Fastify backend

### From Create React App

- Add API backend with shared database
- Monorepo structure improves code organization
- Better development experience with hot reload

## Learn More

### Documentation

- [Fastify Documentation](https://fastify.dev/) - High-performance web framework
- [React Router Documentation](https://reactrouter.com/) - Modern React routing
- [Prisma Documentation](https://prisma.io/docs) - Next-generation ORM
- [Turborepo Documentation](https://turbo.build/) - Monorepo build system
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Community

- [Fastify Discord](https://discord.gg/fastify)
- [React Router Discord](https://discord.gg/reactrouter)
- [Prisma Discord](https://discord.gg/prisma)

## Contributing

We welcome contributions! This project uses a "living template" approach - improvements to this repository directly benefit all generated projects.

```bash
git clone https://github.com/jarodtaylor/test-final-audit.git
cd test-final-audit
pnpm install
pnpm dev                # Test the template
./scripts/test-cli-local.sh  # Test CLI generation
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Ready to Build Something Amazing? 🎉

```bash
npx create-fastify-react-router my-awesome-app
cd my-awesome-app
pnpm dev
```

**Happy coding!** 🚀
