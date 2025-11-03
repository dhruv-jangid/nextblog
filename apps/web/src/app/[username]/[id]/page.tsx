import "server-only";
import Link from "next/link";
import type { Metadata } from "next";
import { Like } from "@/components/like";
import { Share } from "./_components/share";
import { Author } from "@/components/author";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/components/comment";
import { notFound, redirect } from "next/navigation";
import { EditDelete } from "./_components/edit-delete";
import { AuthService } from "@/core/auth/auth.service";
import { BlogService } from "@/core/blog/blog.service";
import { ContentViewer } from "@/components/content-viewer";
import { CommentService } from "@/core/comment/comment.service";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}): Promise<Metadata> => {
  const { username, id } = await params;

  return {
    title: `${username} | ${id}`,
  };
};

export default async function Blog({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const blogService = new BlogService(session);
  const blog = await blogService.find(id);
  if (!blog) {
    notFound();
  }

  const commentService = new CommentService(session);
  const { comments } = await commentService.findByBlogId(blog.id);

  const isAuthor =
    session.role === "admin" || session.username === blog.author.username;

  return (
    <div className="space-y-8 lg:space-y-12 my-14 lg:my-24 w-11/12 md:w-md lg:w-xl xl:w-3xl mx-auto">
      <EditDelete blogId={blog.id} isMobile />

      <div className="flex justify-between">
        <h1 className="text-6xl text-balance lg:w-4/5 leading-16 tracking-tighter">
          {blog.title}
        </h1>

        <EditDelete blogId={blog.id} />
      </div>

      <div className="space-x-4">
        <time>
          {new Intl.DateTimeFormat("en-GB", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(blog.createdAt))}
        </time>
        <Badge asChild>
          <Link href={`/category/${blog.category}`}>{blog.category}</Link>
        </Badge>
      </div>

      <ContentViewer content={blog.content} />

      <div className="flex justify-end items-center gap-4 mt-24">
        <hr className="w-4" />
        <Author
          image={blog.author.image}
          name={blog.author.name}
          username={blog.author.username}
        />
      </div>

      <Share username={blog.author.username} blogId={blog.id} />

      <div className="flex items-start justify-between">
        <Like blogId={blog.id} likes={blog.likes} isLiked={blog.isLiked} />
        <Comment
          isAuthor={isAuthor}
          blogId={blog.id}
          comments={comments}
          username={session.username}
        />
      </div>
    </div>
  );
}
