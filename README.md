# NextBlog (MetaPress)

A modern, full-featured blogging platform built with Next.js App Router, Drizzle ORM, PostgreSQL, Redis, and a beautiful UI. Supports rich text editing, authentication, image uploads, and more.

## Live Demo

[metapress.vercel.app](https://metapress.vercel.app)

## Tech Stack

- **Framework:** Next.js (App Router, React Server Components) with Typescript
- **Database:** PostgreSQL (local via Docker, NeonDB in production)
- **ORM:** Drizzle ORM
- **Cache:** Redis (local via Docker, Upstash in production)
- **Authentication:** BetterAuth (GitHub, Google, and credentials)
- **Image Storage:** Cloudinary
- **ML:** NFSWjs (NFSW Detection)
- **Text Editor:** TipTap (Rich Text Editor)
- **Styling:** Tailwind CSS, Shadcn UI
- **Email:** Nodemailer (Gmail SMTP)
- **Other:** Zod (validation), Docker Compose (local dev)

---

## Features

- **Authentication**: Social (GitHub, Google) & credentials, secure sessions, role-based (User/Admin)
- **Blog Management**: Create, edit, delete blogs with rich text, images, categories, and SEO-friendly slugs
- **Comments**: Commenting system per blog
- **Likes**: Like/unlike blogs
- **Image Uploads**: Cloudinary integration, nudity check, multiple images per blog
- **Categories**: Organize blogs by category
- **User Profiles**: Public profile pages, avatars, total likes
- **Contact & Newsletter**: Contact form, newsletter subscription
- **Performance**: Redis caching for blogs, users, categories
- **Admin Panel**: Manage users, moderate content
- **Modern UI**: Responsive, accessible, beautiful design

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

```
Redis (for caching)
- REDIS_URL=

Database (Use local DB url in dev and Neon DB url in prod)
- DATABASE_URL=

Cloudinary (for media storage and image processing)
- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_SECRET=
- CLOUDINARY_URL=

TinyMCE (for rich text editing)
- NEXT_PUBLIC_TINYMCE_API_KEY=

OAuth Providers (Google & GitHub Authentication)
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=
- GITHUB_CLIENT_ID=
- GITHUB_CLIENT_SECRET=

BetterAuth (Authentication & Security)
- BETTER_AUTH_SECRET=
- BETTER_AUTH_URL=

Email (Authentication & Security)
- EMAIL_USER=
- EMAIL_PASS=
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

## Credits

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [BetterAuth](https://github.com/dhruv-jangid/better-auth)
- [Cloudinary](https://cloudinary.com/)
- [NFSWjs](https://nsfwjs.com/)
- [TipTap](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
