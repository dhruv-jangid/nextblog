"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Like } from "@/components/like";
import { useRouter } from "next/navigation";
import { Author } from "@/components/author";
import { Editor } from "@/components/editor";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/components/comment";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/actions/handle-blog";
import { Copy, PencilLine, Trash2 } from "lucide-react";
import { useAlertDialog } from "@/components/providers/alertProvider";

export const BlogClient = ({
  blog,
  isUser,
  isLiked,
  username,
  totalLikes,
}: {
  blog: Blog & { comments: BlogComment[] };
  isUser: boolean;
  isLiked: boolean;
  username: string;
  totalLikes: number;
}) => {
  const router = useRouter();
  const { show } = useAlertDialog();

  const handleDeleteBlog = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteBlog({ blogId: blog.id!, blogSlug: blog.slug! });

      router.replace("/");
      toast.success("Blog deleted");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${blog.user!.username}/${blog.slug}`
      );

      toast.success("Link copied to clipboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-12 my-14 lg:my-24 w-11/12 md:w-md lg:w-xl xl:w-3xl mx-auto">
      {isUser && (
        <div className="flex lg:hidden gap-2 -mb-3">
          <Button
            onClick={() => {
              show({
                title: "Edit this blog?",
                description: `ID: ${blog.id}`,
                actionLabel: "Edit",
                onConfirm: () => router.push(`/editblog/${blog.id}`),
              });
            }}
          >
            Edit <PencilLine />
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              show({
                title: "Delete this blog?",
                actionLabel: "Delete",
                onConfirm: handleDeleteBlog,
              })
            }
          >
            <Trash2 />
          </Button>
        </div>
      )}
      <div className="flex justify-between">
        <h1 className="text-6xl text-balance lg:w-4/5 leading-16 tracking-tighter">
          {blog.title}
        </h1>
        {isUser && (
          <div className="hidden lg:flex gap-2 mt-2">
            <Button
              onClick={() => {
                show({
                  title: "Edit this blog?",
                  description: blog.title,
                  actionLabel: "Edit",
                  onConfirm: () => router.push(`/editblog/${blog.id}`),
                });
              }}
            >
              Edit <PencilLine />
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                show({
                  title: "Delete this blog?",
                  actionLabel: "Delete",
                  onConfirm: handleDeleteBlog,
                })
              }
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <time>
          {new Intl.DateTimeFormat("en-GB", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(blog.createdAt!))}
        </time>
        <Badge asChild>
          <Link href={`/blogs/${blog.category}`}>{blog.category}</Link>
        </Badge>
      </div>

      <Editor content={blog.content} readOnly />

      <div className="flex justify-end items-center gap-4">
        <hr className="w-4 border-input" />
        <Author
          image={blog.user!.image!}
          name={blog.user!.name!}
          username={blog.user!.username!}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <hr className="border-input" />
        <div className="flex justify-between">
          <h3 className="text-muted-foreground tracking-tight">
            Share this blog
          </h3>
          <div>
            <Button size="sm" onClick={copyLink}>
              <Copy /> Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-8">
        <Like blogId={blog.id!} likes={totalLikes} isLiked={isLiked} />
        <div className="w-full">
          <Comment
            isUser={isUser}
            blogId={blog.id!}
            comments={blog.comments}
            username={username}
          />
        </div>
      </div>
    </div>
  );
};
