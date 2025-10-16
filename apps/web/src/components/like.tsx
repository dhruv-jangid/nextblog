"use client";

import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useRef, useState } from "react";
import { likeBlog } from "@/actions/handle-blog";

export const Like = ({
  blogId,
  likes,
  isLiked,
}: {
  blogId: string;
  likes: number;
  isLiked: boolean;
}) => {
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
              toast.error(error.message);
            } else {
              toast.error("Something went wrong");
            }
          }
        }}
        className="flex items-center gap-1 text-pretty"
      >
        {tempIsLiked ? (
          <Heart
            strokeWidth={1}
            size={32}
            cursor="pointer"
            className="fill-red-600 stroke-red-600"
          />
        ) : (
          <Heart
            strokeWidth={1}
            size={32}
            cursor="pointer"
            className="stroke-muted-foreground/50"
          />
        )}
        <span className="text-lg tracking-tight">{tempLikes}</span>
      </div>
    </div>
  );
};
