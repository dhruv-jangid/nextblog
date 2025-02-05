"use client";

import { likeBlog } from "@/actions/handleBlog";
import { useState } from "react";
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
  const [localLikeCount, setLocalLikeCount] = useState(likes);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  const handleLike = async () => {
    await likeBlog(blogId);
    setLocalIsLiked(!localIsLiked);
    setLocalLikeCount(localIsLiked ? localLikeCount - 1 : localLikeCount + 1);
  };

  return (
    <div className="flex items-center gap-1.5 rounded-lg w-max">
      {localIsLiked ? (
        <IoMdHeart
          size={32}
          className="cursor-pointer"
          onClick={handleLike}
          color="#EEEEEE"
        />
      ) : (
        <IoMdHeartEmpty
          size={32}
          className="cursor-pointer"
          onClick={handleLike}
        />
      )}
      <span className="text-lg">{localLikeCount}</span>
    </div>
  );
};
