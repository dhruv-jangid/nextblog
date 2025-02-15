"use client";

import { likeBlog } from "@/actions/handleBlog";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export const Like = ({
  blogId,
  likes,
  isLiked,
}: {
  blogId: string;
  likes: number;
  isLiked: boolean;
}) => {
  const pathname = usePathname();
  const [error, action, isPending] = useActionState(likeBlog, null);

  return (
    <div className="flex items-center gap-1.5">
      <form action={action}>
        <input type="hidden" name="id" id="id" value={blogId} />
        <input type="hidden" name="path" id="path" value={pathname} />
        <button type="submit" disabled={isPending} className="flex">
          {isLiked ? (
            <IoMdHeart
              size={32}
              className="cursor-pointer fill-red-600"
              color="#EEEEEE"
            />
          ) : (
            <IoMdHeartEmpty size={32} className="cursor-pointer text-red-600" />
          )}
        </button>
      </form>
      <span className="text-lg">{likes}</span>
    </div>
  );
};
