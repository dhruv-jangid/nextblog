# MetaPress: The Pulse of Creativity

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Husky** - Git hooks for code quality
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the web application.

## Project Structure

```
nextblog/
├── apps/
│   ├── web/         # Frontend application (Next.js)
```

## Environment Variables

At minimum, the app requires Cloudinary configuration; without it the app will throw at startup (see `apps/web/next.config.ts`). Create a `.env` file at the repo root with the following keys:

```bash
# Required
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Optional/used by features:
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
POSTGRES_URL=
DATABASE_URL=
EMAIL_USER=
EMAIL_PASS=
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
REDIS_URL=
```

## Available Scripts

- `bun dev`: Start application in development mode
- `bun build`: Build application
- `bun check-types`: Check TypeScript types across all apps
