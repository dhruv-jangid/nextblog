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
            setIsPending(false);
            router.refresh();
          }}
          disabled={isPending}
          className="flex disabled:opacity-50 transition-all duration-300"
        >
          {isLiked ? (
            <Heart
              stroke="red"
              fill="red"
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          ) : (
            <Heart
              stroke="#EEE"
              size={32}
              className={`${
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          )}
        </button>
      </div>
      <span className="text-lg">{likes}</span>
    </div>
  );
};
