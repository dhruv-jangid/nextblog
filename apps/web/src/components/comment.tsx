"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import type { CommentType } from "@/lib/static/types";
import { useAlertDialog } from "./providers/alertProvider";
import { addComment, deleteComment } from "@/actions/handleBlog";
import { commentValidator, getFirstZodError } from "@/lib/schemas/shared";

export const Comment = ({
  blogId,
  comments,
  isUser,
  username,
}: {
  blogId: string;
  comments: CommentType[];
  isUser: boolean;
  username: string;
}) => {
  const router = useRouter();
  const { show } = useAlertDialog();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 tracking-tight text-balance">
      <div className="relative flex flex-col gap-2">
        <Textarea
          name="comment"
          id="comment"
          placeholder="Add a comment..."
          className="resize-none min-h-32"
          maxLength={100}
          disabled={loading}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <span className="absolute bottom-12 right-4 text-xs text-muted-foreground">
          {comment.length}/100
        </span>
        <div className="flex justify-end gap-2.5 sm:gap-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              setLoading(true);
              try {
                commentValidator.parse(comment);

                setComment("");
                await addComment({ comment, blogId });
                router.refresh();
                toast.success("Comment added");
              } catch (error) {
                if (error instanceof ZodError) {
                  toast.error(getFirstZodError(error));
                } else if (error instanceof Error) {
                  toast.error(error.message);
                } else {
                  toast.error("Something went wrong");
                }
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !comment.trim()}
          >
            {loading ? "Adding..." : "Comment"}
          </Button>
        </div>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex justify-between p-4 border border-input rounded-xl bg-input/20"
        >
          <div className="flex gap-3">
            <Link
              href={`/${comment.user.username}`}
              className="relative w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                src={comment.user.image || "/images/account.png"}
                alt={comment.user.name}
                fill
                priority
                sizes="(min-width: 768px) 44px"
              />
            </Link>
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/${comment.user.username}`}
                className="font-medium line-clamp-1 underline-hover hover:animate-pulse text-sm w-fit"
              >
                {comment.user.name}
              </Link>
              <span className="text-sm text-neutral-400">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date(comment.createdAt))}
              </span>
              <p className="mt-4">{comment.content}</p>
            </div>
          </div>
          {(isUser || comment.user.username === username) && (
            <Trash2
              size={16}
              className="cursor-pointer stroke-red-600 mt-0.5 mr-0.5"
              onClick={() =>
                show({
                  title: "Delete comment?",
                  description: comment.content,
                  actionLabel: "Delete",
                  onConfirm: async () => {
                    try {
                      await deleteComment({ commentId: comment.id, blogId });
                      router.refresh();
                      toast.success("Comment deleted");
                    } catch (error) {
                      if (error instanceof Error) {
                        toast.error(error.message);
                      } else {
                        toast.error("Something went wrong");
                      }
                    }
                  },
                })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};
