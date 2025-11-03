import "server-only";
import type { Metadata } from "next";
import { Grid } from "@/components/grid";
import { redirect } from "next/navigation";
import { UserService } from "@/core/user/user.service";
import { AuthService } from "@/core/auth/auth.service";

export const metadata: Metadata = {
  title: "Liked Blogs",
  description: "All liked blogs",
};

export default async function LikedBlogs() {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/signin");
  }

  const userService = new UserService(session);
  const { blogs } = await userService.findLikedBlogsById(session.id);

  return blogs.length > 0 ? (
    <div className="min-h-[92dvh]">
      <div className="text-center text-4xl my-16">Liked Blogs</div>
      <Grid blogs={blogs} />
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-dvh text-4xl rounded-lg w-3/4 mx-auto">
      You dont have any liked blogs currently!
    </div>
  );
}
