# NextBlog - Modern Blogging Platform

A feature-rich blogging platform built with the latest Next.js 15, focusing on performance, security, and user experience.

## Live Demo

Visit the live application at [metapress.vercel.app](https://metapress.vercel.app)

## Tech Stack

- **Framework**: Next.js 15.1.6 with React 19
- **Database**: PostgreSQL with Prisma 6.3.1
- **Authentication**: NextAuth.js 5.0 beta
- **Image Storage**: Cloudinary
- **Editor**: TipTap 2.11
- **Styling**: Tailwind CSS 4.0
- **Type Safety**: TypeScript 5.7

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
- URL slugs for SEO
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
DATABASE_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_TRUST_HOST=
```

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd nextblog
npm install
```

2. Set up your environment variables following the example above

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

- `/actions`: Server actions for data operations
- `/app`: Next.js app router pages and layouts
- `/lib`: Utility functions and configurations
- `/prisma`: Database schema and client
- `/public`: Static assets
- `/components`: React components

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment solutions
- TipTap for the rich text editor
- Cloudinary for image management
- Prisma team for the excellent ORM
