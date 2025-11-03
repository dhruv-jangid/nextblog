"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { getFirstZodError } from "@/lib/utils";
import { MessageSquareText, Trash2 } from "lucide-react";
import { useAlertDialog } from "./providers/alertProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createComment, deleteComment } from "@/core/comment/comment.actions";

export const Comment = ({
  blogId,
  comments,
  isAuthor,
  username,
}: {
  blogId: string;
  comments: BlogComment[];
  isAuthor: boolean;
  username: string;
}) => {
  const { show } = useAlertDialog();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);

  const handleAddComment = async () => {
    setLoading(true);
    try {
      const newComment = await createComment({ blogId, content: comment });
      setComment("");
      setCommentsList((prev) => [...prev, newComment]);
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
  };

  const handleDeleteComment = async (blogId: string, comment: BlogComment) => {
    try {
      await deleteComment({ commentId: comment.id, blogId });
      setCommentsList((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-4/5 space-y-6 tracking-tight text-balance">
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
        <span className="absolute bottom-12 right-4 text-xs tracking-tight text-muted-foreground">
          {comment.length}/100
        </span>
        <div className="flex justify-end gap-2.5 sm:gap-4">
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={loading || !comment.trim()}
          >
            {loading ? (
              "..."
            ) : (
              <>
                Comment <MessageSquareText />
              </>
            )}
          </Button>
        </div>
      </div>

      {commentsList.map((comment) => (
        <div
          key={comment.id}
          className="flex justify-between p-4 border border-input rounded-xl bg-input/20"
        >
          <div className="flex gap-3">
            <Link
              href={`/${comment.authorUsername}`}
              className="relative w-8 h-8 rounded-full overflow-hidden"
            >
              <Avatar>
                <AvatarImage
                  src={comment.authorImage || undefined}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName[0].toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col gap-0.5">
              <Link
                href={`/${comment.authorUsername}`}
                className="font-medium line-clamp-1 hover:animate-pulse text-sm w-fit"
              >
                {comment.authorName}
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
          {(isAuthor || comment.authorUsername === username) && (
            <Trash2
              size={16}
              className="cursor-pointer stroke-red-600 mt-0.5 mr-0.5"
              onClick={() =>
                show({
                  title: "Delete comment?",
                  description: comment.content,
                  actionLabel: "Delete",
                  onConfirm: () => handleDeleteComment(blogId, comment),
                })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};
