import BlogGrid from "@/components/bloggrid";
import { allBlogs } from "../actions/db";

export default async function Blogs() {
  const blogs = await allBlogs();

  return <BlogGrid blogs={blogs} />;
}
