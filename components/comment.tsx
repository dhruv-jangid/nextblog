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
      <div className="flex flex-col gap-3">
        <textarea
          name="comment"
          id="comment"
          placeholder="Add a comment..."
          className="w-full p-4 bg-[#191919] rounded-2xl resize-none min-h-[100px] disabled:cursor-not-allowed"
          maxLength={100}
          disabled={isPending}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
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

      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex justify-between p-4 rounded-2xl bg-[#191919]"
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
                  className="font-medium hover:underline"
                >
                  {comment.author.name}
                </Link>
                <span className="text-sm text-gray-400">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }).format(new Date(comment.createdAt))}
                </span>
                <p className="text-gray-200 mt-2">{comment.content}</p>
              </div>
            </div>
            {(isAuthor || (userSlug && comment.author.slug === userSlug)) && (
              <>
                <button
                  onClick={() => setCommentToDelete(comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex p-1.5"
                >
                  <Trash2 size={18} />
                </button>

                {commentToDelete === comment.id && (
                  <div className="fixed inset-0 tr backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded-2xl bg-linear-to-br from-[#191919] from-40% to-transparent max-w-sm w-full mx-4">
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
                              setIsPending(false);
                              router.refresh();
                            }}
                            disabled={isPending}
                            className="bg-red-700 cursor-pointer text-white hover:bg-red-700/80 transition-all duration-300 px-3 py-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};
