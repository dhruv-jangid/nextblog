"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ZodError } from "zod/v4";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Account from "@/public/images/account.png";
import { useToast } from "@/context/toastProvider";
import type { CommentType } from "@/lib/static/types";
import { useAlertDialog } from "@/context/alertProvider";
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
  const { success, error: errorToast } = useToast();

  return (
    <div className="flex flex-col gap-6 tracking-tight text-balance">
      <div className="relative flex flex-col gap-3">
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a comment..."
          className="w-full px-5 py-4 focus:outline-none resize-none min-h-28 disabled:cursor-not-allowed disabled:opacity-50 ring rounded-xl"
          maxLength={100}
          disabled={loading}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <p className="absolute bottom-15 right-6 text-xs text-neutral-400">
          {comment.length}/100
        </p>
        <div className="flex justify-end gap-2.5 sm:gap-4">
          <Button
            onClick={async () => {
              setLoading(true);
              try {
                commentValidator.parse(comment);

                setComment("");
                await addComment({ comment, blogId });
                router.refresh();
                success({ title: "Comment added" });
              } catch (error) {
                if (error instanceof ZodError) {
                  errorToast({ title: getFirstZodError(error) });
                } else if (error instanceof Error) {
                  errorToast({ title: error.message });
                } else {
                  errorToast({ title: "Something went wrong" });
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
          className="flex justify-between p-5 ring rounded-xl"
        >
          <div className="flex gap-3">
            <Link
              href={`/${comment.user.username}`}
              className="relative w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                src={comment.user.image || Account}
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
              size={18}
              onClick={() =>
                show({
                  title: "Delete this comment?",
                  description: comment.content,
                  actionLabel: "Delete",
                  onConfirm: async () => {
                    try {
                      await deleteComment({ commentId: comment.id, blogId });
                      router.refresh();
                      success({ title: "Comment deleted" });
                    } catch (error) {
                      if (error instanceof Error) {
                        errorToast({ title: error.message });
                      } else {
                        errorToast({ title: "Something went wrong" });
                      }
                    }
                  },
                })
              }
              className="cursor-pointer stroke-red-500"
            />
          )}
        </div>
      ))}
    </div>
  );
};
