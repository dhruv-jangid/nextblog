import Carousel from "@/components/carousel";
import BlogGrid from "@/components/bloggrid";
import { allBlogs } from "./actions/db";

export default async function Home() {
  const blogs = await allBlogs();

  return (
    <>
      <Carousel blog={blogs[0]} />
      <BlogGrid blogs={blogs} />
    </>
  );
}
