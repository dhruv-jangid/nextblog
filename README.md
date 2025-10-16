# MetaPress: The Pulse of Creativity

A modern, full-featured blogging platform built with Next.js 15, featuring rich text editing, user authentication, content moderation, admin management capabilities, and MCP (Model Context Protocol) integration.

## Overview

MetaPress is a comprehensive blogging platform that empowers writers and creators to share their stories with the world. Built with modern web technologies, it provides a seamless experience for both content creators and readers, with advanced features like real-time collaboration, content moderation, user management, and AI-powered insights through MCP.

### Key Highlights

- **Modern Tech Stack**: Built with Next.js 15, React 19, and TypeScript with Turbopack
- **Rich Content Creation**: Advanced editor with image support, formatting, and media embedding
- **User-Friendly**: Intuitive interface with dark/light mode support
- **Secure & Safe**: Built-in content moderation and user management
- **Scalable**: Designed to handle growth with caching and optimization
- **MCP Integration**: Model Context Protocol support for AI-powered features
- **Docker Support**: Easy local development with Docker Compose

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Setup](#database-setup)
- [Docker Setup](#docker-setup)
- [MCP Integration](#mcp-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### Content Management

- **Rich Text Editor** - Powered by TipTap with support for headings, text formatting, images, emojis, and YouTube embeds
- **Image Management** - Cloudinary integration with automatic image optimization and NSFW detection
- **Category System** - Organized content across multiple predefined categories
- **Content Moderation** - Automatic profanity filtering and inappropriate content detection
- **Character Limits** - 50,000 character limit for blog posts with real-time counter

### User Management

- **Authentication** - Email/password and OAuth (Google, GitHub) authentication via Better Auth
- **User Profiles** - Customizable usernames, display names, and profile images
- **Email Verification** - Required email verification for new accounts
- **Password Reset** - Secure password reset functionality
- **Account Management** - Users can change email, delete accounts, and manage settings
- **Account Features** - Personal profile page, liked posts tracking, and settings management

### Admin Features

- **Admin Dashboard** - Comprehensive admin panel for user and content management
- **User Management** - View all users, their activity, and manage user accounts
- **Content Oversight** - Monitor all blog posts and user activity
- **User Banning** - Ability to ban users with custom reasons and expiration dates
- **Role-based Access** - Admin-only access to management features

### User Experience

- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Dark/Light Mode** - Theme switching with next-themes
- **Interactive UI** - Like system, comments, and user interactions
- **Search & Discovery** - Category-based content browsing and search
- **Caching** - Redis-powered caching for improved performance
- **Real-time Updates** - Live character counting and form validation
- **About & Contact Pages** - Professional about page and contact form for user engagement

### Security & Safety

- **Content Safety** - NSFW detection using TensorFlow.js models
- **Profanity Filtering** - Multi-language profanity detection
- **Input Validation** - Comprehensive form validation with Zod schemas
- **Secure Authentication** - JWT-based sessions with secure cookie handling
- **Rate Limiting** - Protection against spam and abuse

### MCP Integration

- **Model Context Protocol** - AI-powered user information retrieval
- **User Info Tool** - Get detailed user statistics and information
- **Multiple Transport Support** - HTTP, SSE, and WebSocket support
- **Vercel MCP Adapter** - Production-ready MCP implementation

## Technology Stack

### Frontend

- **Next.js 15.5+** - React framework with App Router and Server Components
- **React 19** - Latest React with concurrent features
- **TypeScript 5.9+** - Type-safe JavaScript development
- **Tailwind CSS 4.1+** - Modern utility-first CSS framework
- **shadcn/ui** - Reusable UI components built on Radix UI
- **TipTap 3.7+** - Rich text editor with extensive extensions
- **next-themes** - Theme management for dark/light mode
- **Turbopack** - Next-generation bundler for faster development

### Backend & Database

- **Better Auth 1.3+** - Modern authentication library with OAuth support
- **Drizzle ORM 0.44+** - Type-safe database toolkit
- **PostgreSQL** - Primary database (via Neon or local)
- **Redis 5.8+** - Caching and session storage
- **Drizzle Kit 0.31+** - Database migrations and schema management

### Content & Media

- **Cloudinary** - Image upload, optimization, and management
- **TensorFlow.js 4.22+** - Client-side NSFW detection
- **NSFWJS 4.2+** - Content moderation models
- **Obscenity** - Profanity filtering library

### AI & Integration

- **@modelcontextprotocol/sdk 1.17+** - MCP SDK for AI integration
- **@vercel/mcp-adapter 1.0+** - Vercel's MCP adapter for production

### Development & Build

- **Bun 1.2+** - Fast JavaScript runtime and package manager
- **Turborepo 2.5+** - Monorepo build system
- **Husky** - Git hooks for code quality
- **ESLint** - Code linting and formatting
- **Zod 4.1+** - Runtime type validation

### Email & Notifications

- **Nodemailer 7.0+** - Email sending functionality
- **Sonner 2.0+** - Toast notifications

## Getting Started

### Prerequisites

- Bun 1.2+ installed
- PostgreSQL (local or remote)
- Redis (optional, for caching)
- Cloudinary account

### Installation

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
metapress/
├── apps/
│   └── web/                    # Next.js application
│       ├── src/
│       │   ├── app/            # App Router pages and layouts
│       │   │   ├── (auth)/     # Authentication pages (signin, signup, reset)
│       │   │   ├── [username]/ # User profile and blog pages
│       │   │   ├── about/      # About page
│       │   │   ├── account/    # Account management
│       │   │   │   ├── liked/  # Liked posts
│       │   │   │   ├── profile/# User profile settings
│       │   │   │   └── settings/# Account settings
│       │   │   ├── admin/      # Admin dashboard and management
│       │   │   ├── api/        # API routes
│       │   │   │   ├── [transport]/ # MCP endpoints
│       │   │   │   ├── auth/   # Authentication endpoints
│       │   │   │   └── checkTitle/ # Title validation
│       │   │   ├── blogs/      # Blog listing and category pages
│       │   │   ├── contact/    # Contact page
│       │   │   ├── createblog/ # Blog creation interface
│       │   │   └── editblog/   # Blog editing interface
│       │   ├── actions/        # Server actions for data mutations
│       │   ├── components/     # Reusable UI components
│       │   │   ├── ui/         # shadcn/ui components
│       │   │   ├── providers/  # React context providers
│       │   │   └── sidebar/    # Sidebar components
│       │   ├── db/             # Database schema and migrations
│       │   │   └── drizzle/    # Generated migration files
│       │   ├── hooks/          # Custom React hooks
│       │   └── lib/            # Utility functions and configurations
│       │       ├── email/      # Email templates and sending
│       │       ├── schemas/    # Zod validation schemas
│       │       │   └── mcp.ts  # MCP-specific schemas
│       │       └── static/     # Static assets and fonts
│       ├── public/             # Static assets
│       │   ├── models/         # TensorFlow.js models for NSFW detection
│       │   └── images/         # Static images and icons
│       ├── docker-compose.yml  # Docker configuration
│       └── drizzle.config.ts   # Drizzle ORM configuration
├── bunfig.toml                 # Bun configuration
├── package.json                # Root package.json with workspace config
└── turbo.json                  # Turborepo configuration
```

## Environment Variables

Create a `.env` file at the repository root with the following variables:

### Required Variables

```bash
# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database (Required for data persistence)
DATABASE_URL=postgresql://username:password@localhost:5432/metapress
# OR for Neon/other providers:
POSTGRES_URL=postgresql://username:password@host:port/database

# Authentication (Required for user management)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### Optional Variables

```bash
# OAuth Providers (Enable social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Service (Enable email notifications)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Redis/Caching (Improve performance)
REDIS_URL=redis://localhost:6379
# OR for Upstash/other providers:
KV_URL=your_redis_url
KV_REST_API_URL=your_redis_rest_url
KV_REST_API_TOKEN=your_redis_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
```

### Docker Variables (for local development)

```bash
# PostgreSQL Docker Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=metapress
```

### Environment Setup

1. Copy `.env.example` to `.env` (if available)
2. Fill in the required variables
3. For development, you can use local PostgreSQL and Redis instances via Docker
4. For production, consider using managed services like Neon (PostgreSQL) and Upstash (Redis)

## Available Scripts

- `bun dev` - Start application in development mode with Turbopack
- `bun build` - Build application for production
- `bun start` - Start production server
- `bun check-types` - Check TypeScript types across all apps
- `bun docker` - Start PostgreSQL and Redis containers
- `bun clean` - Clean build artifacts and dependencies
- `bun in` - Install and update all dependencies to latest versions

## Database Setup

### Using Docker (Recommended for Development)

1. Start PostgreSQL and Redis containers:
   ```bash
   bun docker
   ```

2. Run migrations:
   ```bash
   cd apps/web
   bun drizzle-kit push
   ```

### Local Development (without Docker)

1. Install PostgreSQL locally
2. Create a database named `metapress`
3. Update your `.env` with the local database URL
4. Run migrations:
   ```bash
   cd apps/web
   bun drizzle-kit push
   ```

### Production (Neon/Other Providers)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Update your `.env` with the production database URL
4. Run migrations:
   ```bash
   cd apps/web
   bun drizzle-kit push
   ```

## Docker Setup

The project includes a Docker Compose configuration for easy local development with PostgreSQL and Redis.

### Docker Services

- **PostgreSQL**: Database server on port 5432
- **Redis**: Cache server on port 6379

### Starting Docker Services

```bash
# Using the npm script
bun docker

# Or directly with docker compose
docker compose -f apps/web/docker-compose.yml up -d
```

### Stopping Docker Services

```bash
docker compose -f apps/web/docker-compose.yml down
```

### Viewing Logs

```bash
docker compose -f apps/web/docker-compose.yml logs -f
```

## MCP Integration

MetaPress includes Model Context Protocol (MCP) integration for AI-powered features.

### Available Tools

#### getUserInfo

Get detailed information about a user by username.

**Parameters:**
- `username` (string): Username to lookup (3-30 characters, lowercase, alphanumeric with underscores)

**Returns:**
- User's display name
- Username
- Join date
- Total blogs published
- Total likes received
- User role (ADMIN/USER)

### API Endpoints

The MCP server is available at multiple transport endpoints:

- HTTP: `POST /api/http`
- SSE: `GET /api/sse`
- WebSocket: `WS /api/ws`

### Example Usage

```typescript
// Using the MCP SDK
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: 'metapress-client',
  version: '1.0.0',
});

// Call the getUserInfo tool
const result = await client.callTool({
  name: 'getUserInfo',
  arguments: { username: 'johndoe' }
});
```

### Development

The MCP configuration is located in:
- `apps/web/src/app/api/[transport]/route.ts` - MCP handler
- `apps/web/src/app/api/[transport]/tools.ts` - Tool implementations
- `apps/web/src/lib/schemas/mcp.ts` - Validation schemas

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. MCP endpoints will be automatically available

### Other Platforms

- **Railway**: Supports PostgreSQL and Redis out of the box
- **Render**: Full-stack deployment with database support
- **DigitalOcean App Platform**: Managed hosting with database options

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

- Database connection string (DATABASE_URL or POSTGRES_URL)
- Cloudinary credentials (CLOUDINARY_*)
- Authentication secrets (BETTER_AUTH_*)
- Redis connection (optional, for caching)
- OAuth credentials (optional, for social login)
- Email credentials (optional, for notifications)

### Build Configuration

The project uses:
- **Turbopack** for development builds (faster hot reload)
- **Next.js production build** for optimized production bundles
- **Bun** as the package manager (ensure your platform supports it)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Update documentation for new features
- Use Turbopack for faster development
- Test on multiple devices and browsers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Better Auth](https://www.better-auth.com/) for authentication
- [TipTap](https://tiptap.dev/) for the rich text editor
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Cloudinary](https://cloudinary.com/) for image management
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Vercel](https://vercel.com/) for MCP adapter and hosting
- [Model Context Protocol](https://modelcontextprotocol.io/) for AI integration
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Bun](https://bun.sh/) for the fast runtime and package manager

---

**Version**: 1.1.0  
**Author**: dhruvjangid  
**Description**: The Pulse of Creativity

For questions or support, visit the [Contact](/contact) page or open an issue on GitHub.