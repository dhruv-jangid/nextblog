"use client";

import Link from "next/link";
import { Like } from "@/components/like";
import { useRouter } from "next/navigation";
import { Author } from "@/components/author";
import { Comment } from "@/components/comment";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";
import { deleteBlog } from "@/actions/handleBlog";
import { useToast } from "@/context/toastProvider";
import { RichTextEditor } from "@/components/editor";
import { Copy, PencilLine, Trash2 } from "lucide-react";
import { useAlertDialog } from "@/context/alertProvider";
import type { BlogType, CommentType } from "@/lib/static/types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function BlogClient({
  blog,
  isUser,
  isLiked,
  username,
}: {
  blog: BlogType & { content: JSONContent; comments: CommentType[] };
  isUser: boolean;
  isLiked: boolean;
  username: string;
}) {
  const { toast, success, error: errorToast } = useToast();
  const { show } = useAlertDialog();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 lg:gap-12 my-14 lg:my-24 w-11/12 lg:w-5/12 mx-auto">
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
            onClick={() =>
              show({
                title: "Delete this blog?",
                actionLabel: "Delete",
                onConfirm: async () => {
                  toast({ title: "Deleting this blog..." });
                  try {
                    await deleteBlog({ blogId: blog.id });
                  } catch (error) {
                    if (isRedirectError(error)) {
                      success({ title: "Blog deleted" });
                    } else if (error instanceof Error) {
                      toast({ title: error.message });
                    } else {
                      toast({ title: "Something went wrong" });
                    }
                  }
                },
              })
            }
          >
            <Trash2 />
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        <h1
          className={`${titleFont.className} text-6xl text-balance lg:w-4/5 leading-16`}
        >
          {blog.title}
        </h1>
        {isUser && (
          <div className="hidden lg:flex gap-2">
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
              onClick={() =>
                show({
                  title: "Delete this blog?",
                  actionLabel: "Delete",
                  onConfirm: async () => {
                    toast({ title: "Deleting..." });
                    try {
                      await deleteBlog({ blogId: blog.id });
                    } catch (error) {
                      if (isRedirectError(error)) {
                        success({ title: "Blog deleted" });
                      } else if (error instanceof Error) {
                        toast({ title: error.message });
                      } else {
                        toast({ title: "Something went wrong" });
                      }
                    }
                  },
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
          }).format(new Date(blog.createdAt))}
        </time>
        <Link href={`/blogs/${blog.category}`}>
          <Button variant="outline" className="tracking-tight">
            {blog.category}
          </Button>
        </Link>
      </div>

      <RichTextEditor content={blog.content} readOnly />

      <div className="flex justify-end items-center gap-3.5">
        <hr className="w-3.5" />
        <Author
          image={blog.user.image}
          name={blog.user.name}
          username={blog.user.username}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <hr />
        <div className="flex justify-between">
          <h3>Share this Blog</h3>
          <div>
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}/${blog.user.username}/${blog.slug}`
                  );
                  success({ title: "Link copied to clipboard" });
                } catch (error) {
                  if (error instanceof Error) {
                    errorToast({ title: error.message });
                  } else {
                    errorToast({ title: "Something went wrong" });
                  }
                }
              }}
            >
              <Copy /> Copy Link
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-8">
        <Like blogId={blog.id} likes={blog.likes.length} isLiked={isLiked} />
        <div className="w-full">
          <Comment
            isUser={isUser}
            blogId={blog.id}
            comments={blog.comments}
            username={username}
          />
        </div>
      </div>
    </div>
  );
}
