"use client";

import { likeBlog } from "@/actions/handleBlog";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Like = ({
  blogSlug,
  likes,
  isLiked,
}: {
  blogSlug: string;
  likes: number;
  isLiked: boolean;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="flex items-center gap-1 antialiased">
      <div>
        <button
          onClick={async () => {
            setIsPending(true);
            await likeBlog(blogSlug);
            router.refresh();
            setIsPending(false);
          }}
          disabled={isPending}
          className="flex disabled:opacity-50 transition-all duration-300"
        >
          {isLiked ? (
            <Heart
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              } stroke-red-700 fill-red-700`}
            />
          ) : (
            <Heart
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              } stroke-red-700`}
            />
          )}
        </button>
      </div>
      <span className="text-lg">{likes}</span>
    </div>
  );
};
