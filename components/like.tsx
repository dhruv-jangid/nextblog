"use client";

import { Heart } from "lucide-react";
import { useRef, useState } from "react";
import { likeBlog } from "@/actions/handleBlog";
import { useToast } from "@/context/toastProvider";

export const Like = ({
  blogId,
  likes,
  isLiked,
}: {
  blogId: string;
  likes: number;
  isLiked: boolean;
}) => {
  const { error: errorToast } = useToast();
  const [tempLikes, setTempLikes] = useState(likes);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempIsLiked, setTempIsLiked] = useState(isLiked);

  return (
    <div className="flex items-center gap-1 antialiased">
      <div
        onClick={() => {
          try {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(async () => {
              await likeBlog({ blogId });
            }, 300);
            setTempIsLiked(!tempIsLiked);
            setTempLikes(tempIsLiked ? tempLikes - 1 : tempLikes + 1);
          } catch (error) {
            if (error instanceof Error) {
              errorToast({ title: error.message });
            } else {
              errorToast({ title: "Something went wrong" });
            }
          }
        }}
        className="flex items-center gap-1 text-pretty"
      >
        {tempIsLiked ? (
          <Heart strokeWidth={1} size={32} fill="red" cursor="pointer" />
        ) : (
          <Heart strokeWidth={1} size={32} cursor="pointer" />
        )}
        <span className="text-lg">{tempLikes}</span>
      </div>
    </div>
  );
};
