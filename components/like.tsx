"use client";

import { likeBlog } from "@/actions/handleBlog";
import { Heart } from "lucide-react";
import { useRef, useState } from "react";

export const Like = ({
  blogSlug,
  likes,
  isLiked,
}: {
  blogSlug: string;
  likes: number;
  isLiked: boolean;
}) => {
  const [tempIsLiked, setTempIsLiked] = useState(isLiked);
  const [tempLikes, setTempLikes] = useState(likes);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div className="flex items-center gap-1 antialiased">
      <div>
        <button
          onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(async () => {
              await likeBlog(blogSlug);
            }, 500);
            setTempIsLiked(!tempIsLiked);
            setTempLikes(tempIsLiked ? tempLikes - 1 : tempLikes + 1);
          }}
          className="flex"
        >
          {tempIsLiked ? (
            <Heart
              size={32}
              className="cursor-pointer stroke-red-700 hover:fill-red-800 hover:stroke-red-800 fill-red-700 transition-all duration-300"
            />
          ) : (
            <Heart
              size={32}
              className="cursor-pointer hover:stroke-red-800 stroke-red-700 transition-all duration-300"
            />
          )}
        </button>
      </div>
      <span className="text-lg">{tempLikes}</span>
    </div>
  );
};
