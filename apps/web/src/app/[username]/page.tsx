import "server-only";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { UserGrid } from "./_components/grid";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AuthService } from "@/core/auth/auth.service";
import { UserService } from "@/core/user/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> => {
  const { username } = await params;

  return {
    title: username,
    description: `View the profile of ${username}.`,
  };
};

export default async function User({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/signin");
  }

  const { username } = await params;

  const userService = new UserService(session);
  const user = await userService.findByUsername(username);
  if (!user) {
    notFound();
  }

  const { blogs } = await userService.findBlogs(user.id);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-8 xl:gap-12 w-full pt-12 pb-14 lg:pt-14 lg:pb-16 xl:py-18">
        <div className="mt-2 lg:mt-1 xl:mt-0">
          <Avatar className="aspect-square size-20 lg:size-24 xl:size-28 rounded-xl">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-3xl">
              {user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <div className="text-3xl lg:text-4xl tracking-tight">
            {user.username}
          </div>
          <div className="inline-flex items-center gap-2">
            {blogs.length}
            <span className="text-muted-foreground">Blogs</span>
          </div>
          <div className="flex gap-2 items-center text-lg opacity-85 tracking-tight font-medium">
            {user.name}
            {user.role === "admin" && (
              <Badge variant="destructive">{user.role.toUpperCase()}</Badge>
            )}
          </div>
        </div>
      </div>

      {blogs.length > 0 ? (
        <div className="min-h-[60dvh] md:min-h-[68dvh] w-full lg:px-8 xl:px-16">
          <UserGrid blogs={blogs} />
        </div>
      ) : (
        <>
          <Separator />

          <div className="flex justify-center items-center min-h-[75dvh] text-4xl w-full text-muted-foreground text-center">
            {user.isSelf ? (
              <Button variant="secondary" asChild>
                <Link href="/create-blog">Create your first blog</Link>
              </Button>
            ) : (
              <div className="tracking-tighter">
                This user have not published any blogs yet!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
