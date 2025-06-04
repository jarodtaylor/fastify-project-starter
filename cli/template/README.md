# create-fastify-react-router

> A CLI generator for modern fullstack monorepo applications with Fastify API and React Router 7 frontend.

## Quick Start

```bash
npx create-fastify-react-router my-app
cd my-app
pnpm dev
```

That's it! You'll have a complete fullstack application running with API, frontend, database, and modern tooling.

## What Gets Generated

Running the CLI creates a production-ready monorepo with:

- **🏗️ Monorepo Architecture** - Turborepo + pnpm workspaces
- **🚀 Fastify API** - High-performance Node.js backend with TypeScript
- **⚛️ React Router 7** - Modern React with SSR and file-based routing
- **🗄️ Database Ready** - Prisma ORM with SQLite (easily switch to PostgreSQL/MySQL)
- **🎨 Styled** - Tailwind CSS with responsive design
- **🔧 Developer Experience** - Hot reload, TypeScript, Biome linting
- **📱 Working Example** - Complete Todo CRUD application

## CLI Options

```bash
npx create-fastify-react-router [project-name] [options]

Options:
  --db <database>     Database (sqlite, postgres, mysql) [default: sqlite]
  --orm <orm>         ORM (prisma, none) [default: prisma]
  --lint <linter>     Linter (biome, eslint) [default: biome]
  --no-install        Skip dependency installation
  --no-git            Skip git initialization
```

### Examples

```bash
# Basic usage
npx create-fastify-react-router my-app

# With PostgreSQL
npx create-fastify-react-router my-app --db postgres

# Skip installation for manual setup
npx create-fastify-react-router my-app --no-install --no-git
```

## Generated Project Structure

```
my-app/
├── apps/
│   ├── api/              # Fastify API server (localhost:3001)
│   └── web/              # React Router 7 app (localhost:5173)
├── packages/
│   ├── database/         # Shared Prisma database
│   ├── shared-utils/     # Shared utilities
│   └── ui/               # Shared UI components
├── package.json          # Root workspace configuration
└── turbo.json           # Turborepo build orchestration
```

## After Generation

Your new project includes:

**Backend (Fastify API)**

- TypeScript with hot reload
- Prisma ORM integration
- CORS and error handling
- Complete Todo CRUD API

**Frontend (React Router 7)**

- Server-side rendering (SSR)
- Tailwind CSS styling
- Form actions with optimistic UI
- Responsive Todo interface

**Development Tools**

- Turborepo for parallel builds and caching
- Biome for fast linting and formatting
- TypeScript configurations
- pnpm workspace management

## Database Configuration

**SQLite (Default)**

- Zero configuration required
- Perfect for development
- Database file in `data/dev.db`

**PostgreSQL/MySQL**

- Production-ready options
- Update `DATABASE_URL` in `.env`
- Change provider in Prisma schema

## Deployment

Generated projects are ready for deployment on:

- **Vercel** - Zero-config deployment
- **Railway** - Database + app hosting
- **Docker** - Containerized deployment
- **Traditional VPS** - PM2 or systemd

## Contributing

This project uses a "living template" approach - the CLI copies and customizes this entire repository to generate new projects.

**Ways to contribute:**

- 🐛 [Report bugs](https://github.com/jarodtaylor/fastify-react-router-starter/issues)
- 💡 [Request features](https://github.com/jarodtaylor/fastify-react-router-starter/issues)
- 🔧 Improve the template (apps/, packages/, configs)
- ⚡ Enhance the CLI generator (cli/ directory)
- 📚 Improve documentation

**Development setup:**

```bash
git clone https://github.com/jarodtaylor/fastify-react-router-starter.git
cd fastify-react-router-starter
pnpm install
pnpm dev  # Test the template
pnpm build:cli  # Build the CLI
```

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Learn More

- [Fastify Documentation](https://fastify.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Prisma Documentation](https://prisma.io/docs)
- [Turborepo Documentation](https://turbo.build/)

## License

MIT - see [LICENSE](LICENSE) for details.

---

**Ready to build something amazing?** 🎉

```bash
npx create-fastify-react-router my-awesome-app
```
