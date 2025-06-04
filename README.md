# Fastify React-Router Starter

A modern, production-ready monorepo template for building fullstack applications with **Fastify APIs** and **React Router 7** frontends.

## Features

- **Monorepo**: Using [pnpm workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turborepo.com/docs)
- **API Backend**: [Fastify](https://fastify.dev/) with TypeScript and hot reload
- **Frontend**: [React Router 7](https://reactrouter.com/home) with SSR and [Tailwind 4](https://tailwindcss.com/docs)
- **Developer Experience**: [Biome](https://biomejs.dev/) for formatting and linting
- **Package Management**: Clean `@` imports with path mapping
- **Quality Gates**: Pre-commit checks for formatting, linting, type safety, and tests

## Structure

```
├── apps/
│   ├── api/                 # Fastify API server
│   └── web/                 # React Router 7 frontend
├── packages/
│   ├── shared-utils/        # Shared utilities and types
│   └── typescript-config/   # Base TypeScript configuration
├── biome.json              # Linting and formatting config
├── turbo.json              # Build orchestration
└── pnpm-workspace.yaml     # Workspace configuration
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Approve build scripts (for Tailwind native components)
pnpm approve-builds
```

### Development

```bash
# Start both API and web app
pnpm dev

# Or start individually
pnpm dev:api    # API only (http://localhost:3000)
pnpm dev:web    # Web app only (http://localhost:5173)
```

### Building

```bash
# Build all apps
pnpm build

# Run production servers
pnpm start
```

### Quality Checks

```bash
# Full quality pipeline
pnpm check

# Individual checks
pnpm lint        # Biome linting
pnpm format      # Biome formatting
pnpm typecheck   # TypeScript compilation
pnpm test        # Run tests
pnpm audit       # Security audit
```

## Key Configuration Notes

### TypeScript Path Mapping

**Works for code imports:**

```typescript
import { createApiResponse } from "@fastify-react-router-starter/shared-utils";
```

### Adding New Packages

1. Create the package directory under `packages/`
2. Add proper `package.json` with `@fastify-react-router-starter/*` naming
3. Export types/functions you want to share
4. Import using clean syntax: `@fastify-react-router-starter/package-name`

### Adding New Apps

1. Create the app directory under `apps/`
2. Set up `tsconfig.json` with proper `baseUrl: "../../"`
3. Add build/dev scripts to `package.json`
4. Apps automatically get access to `@fastify-react-router-starter/*` imports

## Demo Integration

The template includes a working demo that shows:

- API ↔ Frontend communication
- Shared utilities across packages
- Type safety end-to-end
- Development workflow with hot reload
- Build and production deployment

Visit the web app to see the API integration in action with proper error handling and loading states.

## Deployment Ready

This template is designed for deployment on:

- **Cloudflare**: Native support for both API and frontend
- **Vercel**: React Router 7 SSR + Serverless API
- **Railway/Fly.io**: Containerized full-stack deployment
- **AWS/GCP/Azure**: Traditional cloud deployment

## Tech Stack

| Layer        | Technology                | Purpose                          |
| ------------ | ------------------------- | -------------------------------- |
| **API**      | Fastify + TypeScript      | High-performance backend         |
| **Frontend** | React Router 7 + Tailwind | Modern SSR React app             |
| **Build**    | Turborepo + pnpm          | Monorepo orchestration           |
| **Quality**  | Biome + TypeScript        | Linting, formatting, type safety |
| **DevX**     | tsx + Vite                | Hot reload and fast builds       |

---
