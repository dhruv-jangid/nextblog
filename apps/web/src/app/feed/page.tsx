import "server-only";
import type { Metadata } from "next";
import { Grid } from "@/components/grid";
import { CommonService } from "@/core/common/common.service";

export const metadata: Metadata = {
  title: "Feed",
  description: "View blogs on MetaPress",
};

export default async function Feed() {
  const blogs = await CommonService.getBlogsFeed();

  return (
    <>
      {blogs.length > 0 ? (
        <div className="min-h-dvh lg:mx-16">
          <div className="mt-16 md:mt-20 ml-auto mr-6 lg:mr-12 pb-2 w-2xs lg:w-md text-end text-3xl lg:text-4xl tracking-tight border-b border-accent-foreground/50 border-dashed">
            ... Feed
          </div>
          <Grid blogs={blogs} />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-dvh text-4xl rounded-lg w-3/4 mx-auto">
          There are currently no blogs to display!
        </div>
      )}
    </>
  );
}
