"use client";

import Image from "next/image";
import Account from "@/public/images/account.png";
import { Button } from "@/components/button";
import Link from "next/link";
import { addComment, deleteComment } from "@/actions/handleBlog";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const Comment = ({
  blogSlug,
  comments,
  isAuthor,
  userSlug,
}: {
  blogSlug: string;
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      name: string;
      image: string | null;
      slug: string;
    };
  }[];
  isAuthor: boolean;
  userSlug: string;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  return (
    <div className="flex flex-col gap-6 tracking-tight text-balance">
      <div className="relative flex flex-col gap-3">
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a comment..."
          className="w-full px-5 py-4 bg-neutral-900 rounded-4xl focus:outline-none resize-none min-h-28 disabled:cursor-not-allowed ring ring-neutral-800 focus:ring-rose-300 transition-all duration-300"
          maxLength={100}
          disabled={isPending}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <p className="absolute bottom-15 right-6 text-xs text-neutral-400">
          {comment.length}/100
        </p>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              setComment("");
              setIsPending(true);
              await addComment(comment, blogSlug);
              setIsPending(false);
              router.refresh();
            }}
            disabled={isPending || !comment.trim()}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex justify-between px-6 py-5 rounded-4xl bg-neutral-900"
        >
          <div className="flex gap-3">
            <Link href={`/${comment.author.slug}`}>
              <Image
                src={comment.author.image || Account}
                alt={comment.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`/${comment.author.slug}`}
                className="font-medium hover:underline underline-offset-2 text-rose-300"
              >
                {comment.author.name}
              </Link>
              <span className="text-sm text-neutral-400 leading-2.5">
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
          {(isAuthor || (userSlug && comment.author.slug === userSlug)) && (
            <>
              <Trash2
                size={18}
                onClick={() => setCommentToDelete(comment.id)}
                className="text-neutral-400 hover:text-rose-300 transition-all duration-300 cursor-pointer"
              />

              {commentToDelete === comment.id && (
                <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-neutral-900 p-6 rounded-4xl max-w-sm w-full mx-4">
                    <p className="mb-6">
                      Are you sure you want to delete this comment:
                      <br />
                      {comment.content}
                    </p>
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={() => setCommentToDelete(null)}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                      <div>
                        <input
                          type="hidden"
                          name="commentId"
                          value={comment.id}
                        />
                        <button
                          onClick={async () => {
                            setIsPending(true);
                            await deleteComment(comment.id);
                            router.refresh();
                            setIsPending(false);
                            setCommentToDelete(null);
                          }}
                          disabled={isPending}
                          className="bg-red-800 cursor-pointer hover:bg-neutral-800 hover:text-rose-300 transition-all duration-300 px-3.5 py-2 leading-tight rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
