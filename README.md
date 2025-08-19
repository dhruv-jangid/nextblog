# MetaPress

A modern, full-featured blogging platform built with Next.js App Router, Drizzle ORM, PostgreSQL, Redis, and a beautiful UI. Supports rich text editing, authentication, image uploads, and more.

## Live Demo

[metapress.vercel.app](https://metapress.vercel.app)

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components) with TypeScript
- **Database:** PostgreSQL (local via Docker, NeonDB in production)
- **ORM:** Drizzle ORM
- **Cache:** Redis (local via Docker, Upstash in production)
- **Authentication:** BetterAuth (GitHub, Google, and credentials)
- **Image Storage:** Cloudinary
- **ML:** NFSWjs (NSFW Detection), TensorFlow.js
- **Text Editor:** TipTap (Rich Text Editor with extensions)
- **Styling:** Tailwind CSS 4, Shadcn UI, Radix UI
- **Email:** Nodemailer (Gmail SMTP)
- **Other:** Zod (validation), Docker Compose (local dev), MCP SDK

---

## Features

- **Authentication**: Social (GitHub, Google) & credentials, secure sessions, role-based (User/Admin)
- **Blog Management**: Create, edit, delete blogs with rich text, images, categories, and SEO-friendly slugs
- **Comments**: Commenting system per blog
- **Likes**: Like/unlike blogs
- **Image Uploads**: Cloudinary integration, NSFW detection, multiple images per blog
- **Categories**: Organize blogs by category
- **User Profiles**: Public profile pages, avatars, total likes
- **Contact & Newsletter**: Contact form, newsletter subscription
- **Performance**: Redis caching for blogs, users, categories
- **Admin Panel**: Manage users, moderate content
- **Modern UI**: Responsive, accessible, beautiful design with dark/light theme support
- **Content Moderation**: NSFW detection, profanity filtering

---

## Folder Structure

```
actions/         # Server actions (blog, user, cache, cloudinary)
app/             # Next.js App Router pages & routes
  (auth)/        # Auth pages (signin, signup, reset password)
  [username]/    # User profile & blog pages
  blogs/         # Blog listing & category pages
  createblog/    # Blog creation
  editblog/      # Blog editing
  admin/         # Admin panel & dashboard
  ...            # About, contact, settings, etc.
components/      # UI components (navbar, footer, blog grid, editor, etc.)
context/         # React context providers (theme, toast, alert)
db/              # Drizzle ORM schema, relations, migrations
lib/             # Utilities (auth, redis, email, image, schemas, types)
public/          # Static assets (images, fonts, diagrams, ML models)
```

---

## Local Development

### 1. Clone & Install

```bash
git clone https://github.com/dhruv-jangid/nextblog.git
cd nextblog
npm install
```

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Redis (for caching)
REDIS_URL=

# Database (Use local DB url in dev and Neon DB url in prod)
DATABASE_URL=

# Cloudinary (for media storage and image processing)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# OAuth Providers (Google & GitHub Authentication)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (Authentication & Security)
EMAIL_USER=
EMAIL_PASS=
```

### 3. Start Docker (Postgres & Redis)

```bash
docker-compose up -d
```

### 4. Run Migrations

```bash
npx drizzle-kit push:pg
```

### 5. Start Dev Server

```bash
npm run dev
```

---

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean install (remove node_modules and reinstall)

---

## Credits

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [BetterAuth](https://github.com/dhruv-jangid/better-auth)
- [Cloudinary](https://cloudinary.com/)
- [NFSWjs](https://nsfwjs.com/)
- [TipTap](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
