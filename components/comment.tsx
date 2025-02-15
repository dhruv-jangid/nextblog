"use client";

import Image from "next/image";
import Account from "@/public/images/account.png";
import { Button } from "./button";
import Link from "next/link";
import { useActionState } from "react";
import { addComment, deleteComment } from "@/actions/handleBlog";
import { usePathname } from "next/navigation";
import { TbTrash } from "react-icons/tb";
import { useState } from "react";

type CommentType = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image?: string | null;
    slug: string;
  };
};

export const Comment = ({
  blogId,
  comments,
  userSlug,
}: {
  blogId: string;
  comments: CommentType[];
  userSlug: string | null;
}) => {
  const [error, action, isPending] = useActionState(addComment, null);
  const [deleteError, deleteAction, deleteIsPending] = useActionState(
    deleteComment,
    null
  );
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const path = usePathname();

  return (
    <div className="flex flex-col gap-6">
      {error && <div>{error}</div>}
      {deleteError && <div>{deleteError}</div>}
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="blogId" id="blogId" value={blogId} />
        <input type="hidden" name="path" id="path" value={path} />
        <textarea
          name="content"
          id="content"
          placeholder="Add a comment..."
          className="w-full p-4 bg-[#191919] rounded-2xl resize-none min-h-[100px] disabled:cursor-not-allowed"
          maxLength={100}
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button disabled={isPending}>
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

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
            {userSlug && comment.author.slug === userSlug && (
              <>
                <button
                  onClick={() => setCommentToDelete(comment.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex p-1.5"
                >
                  <TbTrash size={20} />
                </button>

                {commentToDelete === comment.id && (
                  <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded-2xl bg-linear-to-br from-[#191919] from-40% to-transparent max-w-sm w-full mx-4">
                      <p className="mb-6">
                        Are you sure you want to delete this comment:
                        <br />
                        {comment.content}
                      </p>
                      <div className="flex justify-end gap-3">
                        <Button
                          onClick={() => setCommentToDelete(null)}
                          disabled={deleteIsPending}
                        >
                          Cancel
                        </Button>
                        <form action={deleteAction}>
                          <input
                            type="hidden"
                            name="commentId"
                            value={comment.id}
                          />
                          <input type="hidden" name="path" value={path} />
                          <button
                            disabled={deleteIsPending}
                            className="bg-red-700 cursor-pointer text-white hover:bg-red-700/80 transition-all duration-300 px-3 py-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleteIsPending ? "Deleting..." : "Delete"}
                          </button>
                        </form>
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
