"use client";

import { likeBlog } from "@/actions/handleBlog";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export const Like = ({
  blogSlug,
  likes,
  isLiked,
}: {
  blogSlug: string;
  likes: number;
  isLiked: boolean;
}) => {
  const pathname = usePathname();
  const [error, action, isPending] = useActionState(likeBlog, null);

  return (
    <div className="flex items-center gap-1 antialiased">
      {error && <div>{error}</div>}
      <form action={action}>
        <input type="hidden" name="slug" id="slug" value={blogSlug} />
        <input type="hidden" name="path" id="path" value={pathname} />
        <button
          type="submit"
          disabled={isPending}
          className="flex disabled:opacity-50 transition-all duration-300"
        >
          {isLiked ? (
            <IoMdHeart
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              } fill-red-600`}
              color="#EEEEEE"
            />
          ) : (
            <IoMdHeartEmpty
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              } fill-red-600`}
            />
          )}
        </button>
      </form>
      <span className="text-lg">{likes}</span>
    </div>
  );
};
