# NextBlog - Modern Blogging Platform

A feature-rich blogging platform built with the latest Next.js features, now refactored with the new App Router, enhanced server components, and an optimized architecture for performance and scalability.

## Live Demo

Visit the live application at [metapress.vercel.app](https://metapress.vercel.app)

## Stack

- **Framework**: Next.js with the new App Router and React Server Components
- **Database**: PostgreSQL with Prisma (Vercel's NeonDB in production)
- **Authentication**: BetterAuth
- **Image Storage**: Cloudinary
- **Text Editor**: TipTap
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript

## Features

### Authentication

- Multiple authentication providers (GitHub, Google)
- Secure session management
- Role-based authorization (User, Admin)

### Blog Management

- Create, edit, and delete blog posts
- Rich text editing with TipTap
- Image upload and management
- Category organization
- SEO-friendly URL slugs
- Like system
- Commenting system

### User Features

- Custom user profiles
- Personal blog dashboard
- Image avatar support
- Secure password handling with Argon2

## Environment Setup

Required environment variables:

```env
- Database (Use this in production or if not using Vercel's DB)
DATABASE_POSTGRES_PRISMA_URL=

- Cloudinary (for media storage and image processing)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

- TinyMCE (for rich text editing)
NEXT_PUBLIC_TINYMCE_API_KEY=

- OAuth Providers (Google & GitHub Authentication)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

- BetterAuth (Authentication & Security)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

- SendGrid (Service for email handling)
SENDGRID_API_KEY=
SENDGRID_EMAIL_FROM=

- SightEngine (API for content moderation)
SIGHTENGINE_API_USER=
SIGHTENGINE_API_SECRET=
```

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd nextblog
npm install
```

2. Set up your environment variables following the example above.

3. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

- `/actions` - Server actions for data operations
- `/app` - Next.js App Router pages, layouts, and server components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and client
- `/public` - Static assets
- `/components` - React components

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment solutions
- TipTap for the rich text editor
- Cloudinary for image management
- Prisma team for the excellent ORM
