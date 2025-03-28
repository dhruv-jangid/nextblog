"use client";

import { likeBlog } from "@/actions/handleBlog";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export const Like = ({
  blogSlug,
  likes,
  isLiked,
  isLoggedIn = true,
}: {
  blogSlug: string;
  likes: number;
  isLiked: boolean;
  isLoggedIn?: boolean;
}) => {
  const [tempIsLiked, setTempIsLiked] = useState(isLiked);
  const [tempLikes, setTempLikes] = useState(likes);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 antialiased">
      <div
        onClick={() => {
          if (isLoggedIn) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(async () => {
              await likeBlog(blogSlug);
            }, 500);
            setTempIsLiked(!tempIsLiked);
            setTempLikes(tempIsLiked ? tempLikes - 1 : tempLikes + 1);
          } else {
            router.push("/signin");
          }
        }}
        className="flex items-center gap-1 text-pretty"
      >
        {tempIsLiked ? (
          <Heart
            size={32}
            className="cursor-pointer stroke-red-700 fill-red-700"
          />
        ) : (
          <Heart size={32} className="cursor-pointer stroke-red-700" />
        )}
        <span className="text-lg">{tempLikes}</span>
      </div>
    </div>
  );
};
