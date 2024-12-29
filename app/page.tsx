"use client";

import Carousel from "@/components/carousel";
import BlogGrid from "@/components/bloggrid";

type Blog = {
  blogImage: string;
  blogTitle: string;
  blogDate: string;
  blogCategory: string;
  userName: string;
  userImage: string;
}[];

export default function Home() {
  return (
    <>
      <Carousel />
      {/* <BlogGrid blogs={blogs} /> */}
    </>
  );
}
