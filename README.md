# MetaPress - The Pulse of Creativity

MetaPress is a modern, feature-rich blogging platform built with Next.js, where writers and creators can share their stories with the world. The platform emphasizes clean design, user experience, and powerful content creation tools.

## Features

- **Rich Text Editor**: Full-featured WYSIWYG editor with support for:

  - Text formatting (bold, italic, underline)
  - Multiple heading levels
  - Image uploads
  - Link embedding
  - History management (undo/redo)

- **User Management**:

  - Secure authentication
  - Custom user profiles
  - Profile image management
  - Account settings

- **Blog Management**:

  - Create, edit, and delete blog posts
  - Category organization
  - Cover image support
  - Like system
  - Slug-based URLs

- **Image Handling**:
  - Cloudinary integration for image storage
  - Automatic image optimization
  - Support for multiple image formats

## Tech Stack

- **Frontend**: Next.js 14+ with React 19
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom cookie-based auth
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Editor**: TipTap
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
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
npx prisma migrate dev
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment solutions
- TipTap for the rich text editor
- Cloudinary for image management
- Prisma team for the excellent ORM

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
