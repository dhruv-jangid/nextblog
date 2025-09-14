"use client";

import { titleFont } from "@/lib/static/fonts";
import { BlogGrid } from "@/components/bloggrid";

export const LikedBlogs = ({ rows }: { rows: any }) => {
  return (
    <>
      {rows.length > 0 ? (
        <div className="min-h-[92dvh]">
          <div className={`${titleFont.className} text-center text-4xl my-16`}>
            Liked Blogs
          </div>
          <BlogGrid blogs={rows} />
        </div>
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[92vh] text-4xl rounded-lg w-3/4 mx-auto`}
        >
          You dont have any liked blogs currently!
        </div>
      )}
    </>
  );
};
