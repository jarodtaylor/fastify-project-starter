# create-fastify-project

The easiest way to get started with a modern fullstack application using Fastify API and React Router 7. This CLI tool enables you to quickly start building a new monorepo project with a Fastify backend and React frontend, with everything set up for you.

## Quick Start

```sh
npx create-fastify-project@latest my-app
```

## Interactive

You can create a new project interactively by running:

```bash
npx create-fastify-project@latest
# or
yarn create fastify-project
# or
pnpm dlx create fastify-project
# or
bunx create-fastify-project
```

You will be prompted for:

- Project name
- Database choice (SQLite, PostgreSQL, MySQL)
- ORM preference (Prisma, None)
- Linter preference (Biome, ESLint)

## Non-interactive

You can also pass command line arguments to set up a new project non-interactively. See `create-fastify-project --help`:

```bash
Usage: create-fastify-project [options] [project-name]

Create a new Fastify + React Router 7 monorepo project

Arguments:
  project-name     Name of the project to create

Options:
  -V, --version    output the version number
  --no-install     Skip dependency installation
  --no-git         Skip git initialization
  --orm <orm>      ORM to use (prisma, none) (default: "prisma")
  --db <database>  Database to use (sqlite, postgres, mysql) (default: "sqlite")
  --lint <linter>  Linter to use (biome, eslint) (default: "biome")
  -h, --help       display help for command
```

## What's Included

Your new project will include:

### Backend (Fastify API)

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Full type safety
- **Database Integration** - Choice of SQLite, PostgreSQL, or MySQL
- **ORM Support** - Optional Prisma integration
- **Environment Configuration** - Ready-to-use env setup
- **CORS & Security** - Pre-configured middleware

### Frontend (React Router 7)

- **React Router 7** - Latest routing with data loading
- **Vite** - Lightning fast build tool
- **TypeScript** - Consistent typing across the stack
- **Tailwind CSS** - Utility-first styling
- **Modern Tooling** - ESLint/Biome for code quality

### Development Experience

- **Monorepo Structure** - Organized workspace with shared configs
- **Hot Reload** - Both frontend and backend development servers
- **Type Safety** - End-to-end TypeScript integration
- **Git Integration** - Automatic repository initialization
- **Package Management** - Works with npm, yarn, pnpm, or bun

## Why use create-fastify-project?

- **Modern Stack**: Built with the latest tools and best practices
- **Full-Stack TypeScript**: Type safety from database to UI
- **Zero Configuration**: Everything works out of the box
- **Flexible**: Choose your database, ORM, and tooling preferences
- **Production Ready**: Includes security, CORS, and deployment configs
- **Developer Experience**: Hot reload, TypeScript, and modern tooling

## Project Structure

```
my-app/
├── apps/
│   ├── api/          # Fastify backend
│   └── web/          # React Router 7 frontend
├── packages/
│   └── shared/       # Shared types and utilities
├── package.json      # Workspace configuration
└── README.md         # Project documentation
```

## Getting Started After Creation

```bash
cd my-app

# Start development servers
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

For more information, see the [Fastify Project Starter documentation](https://github.com/jarodtaylor/fastify-project-starter).
