# MetaPress - The Pulse of Creativity

<div style="display: flex; align-items: center;">
  <img src="./public/images/logo.png" alt="MetaPress Logo" width="48" style="margin-right: 1rem;">
  <p>MetaPress is a modern, feature-rich blogging platform built with Next.js, where writers and creators can share their stories with the world. The platform emphasizes clean design, user experience, and powerful content creation tools. Whether you are a seasoned blogger or just starting out, MetaPress provides an intuitive and seamless experience for creating, managing, and publishing your content. With robust features like a rich text editor, secure user management, and efficient image handling, MetaPress ensures that your creativity is the focus, while the technology works effortlessly in the background.</p>
</div>

## Live Demo

Visit the live application at [metapress.vercel.app](https://metapress.vercel.app)

## Features

### Rich Text Editor

- Full-featured WYSIWYG editor powered by TipTap
- Text formatting (bold, italic, underline)
- Multiple heading levels
- Image uploads with drag-and-drop
- Link embedding
- History management (undo/redo)

### User Management

- Secure authentication with NextAuth.js
- OAuth support (Google, GitHub)
- Custom user profiles
- Profile image management
- Account settings and deletion

### Blog Management

- Create, edit, and delete blog posts
- Category organization
- Cover image support with preview
- Like system
- Comment system
- Slug-based URLs

### Image Handling

- Cloudinary integration for image storage
- Automatic image optimization
- Support for multiple image formats
- Responsive images with Next.js Image component

## Tech Stack

- **Frontend**: Next.js 14+ with React 19
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Editor**: TipTap
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/metapress.git
cd metapress
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with the following variables:

```env
DATABASE_URL="your-postgresql-url"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
OPTIMIZE_API_KEY="your-prisma-optimize-key"
```

4. Run database migrations:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
- `/actions`: Server actions for data mutations
- `/lib`: Utility functions and configurations
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment solutions
- TipTap for the rich text editor
- Cloudinary for image management
- Prisma team for the excellent ORM
