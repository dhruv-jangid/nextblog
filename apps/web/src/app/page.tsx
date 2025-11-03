import "server-only";
import { Grid } from "@/components/grid";
import { VerticalList } from "@/components/v-list";
import { CommonService } from "@/core/common/common.service";

export default async function Home() {
  const [blog1, blog2, ...blogs] = await CommonService.getBlogsFeed();

  return (
    <>
      {blogs.length > 0 ? (
        <div>
          <section className="flex flex-col xl:flex-row lg:m-8 lg:p-6 bg-accent rounded-b-none lg:rounded-xl lg:border">
            <div className="w-1/2 text-9xl lg:text-[10rem] leading-24 lg:leading-30 pl-8 pt-16 pb-8 lg:pb-16 lg:pl-12 tracking-tight">
              <div>BL</div>
              <div className="ml-10">OG-</div>
              <div>NEW</div>
              <div className="flex items-center gap-8">
                <span>S</span>
                <span className="inline-flex flex-col text-2xl lg:text-3xl leading-5 lg:leading-6">
                  <span className="tracking-tight w-max">Latest News </span>
                  <span className="ml-10 tracking-tight w-max">
                    and updates
                  </span>
                </span>
              </div>
            </div>

            <VerticalList blogs={[blog1, blog2]} />
          </section>

          <Grid blogs={blogs} />
        </div>
      ) : (
        <div className="flex justify-center items-center w-xs sm:w-sm lg:w-lg xl:w-4xl text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-balance min-h-dvh tracking-tighter mx-auto">
          Oops! There are no blogs to display currently, please come back later.
        </div>
      )}
    </>
  );
}
