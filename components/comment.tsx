"use client";

import Image from "next/image";
import Account from "@/public/images/account.png";
import { Button } from "./button";
import Link from "next/link";
import { useActionState } from "react";
import { addComment } from "@/actions/handleBlog";
import { usePathname } from "next/navigation";

type CommentType = {
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
}: {
  blogId: string;
  comments: CommentType[];
}) => {
  const [error, action, isPending] = useActionState(addComment, null);
  const path = usePathname();

  return (
    <div className="flex flex-col gap-6">
      {error && <div>{error}</div>}
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="blogId" id="blogId" value={blogId} />
        <input type="hidden" name="path" id="path" value={path} />
        <textarea
          name="content"
          id="content"
          placeholder="Add a comment..."
          className="w-full p-4 bg-[#191919] rounded-xl resize-none min-h-[100px]"
          maxLength={100}
        />
        <div className="flex justify-end">
          <Button>{isPending ? "Posting..." : "Post Comment"}</Button>
        </div>
      </form>

      <div className="flex flex-col gap-4 mt-2">
        {comments.map((comment, index) => (
          <div key={index} className="flex gap-3 p-4 rounded-xl bg-[#191919]">
            <Link href={`/${comment.author.slug}`}>
              <Image
                src={comment.author.image || Account}
                alt={comment.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
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
              </div>
              <p className="text-gray-200">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
