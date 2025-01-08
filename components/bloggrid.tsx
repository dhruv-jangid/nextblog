"use client";

import Button from "@/components/button";
import User from "./user";
import { CldImage } from "next-cloudinary";

export interface BlogType {
  blogid: number;
  title: string;
  date: string;
  category: string;
  userid: number;
  name: string;
}

const Card = ({ blogid, title, date, category, userid, name }: BlogType) => {
  return (
    <div className="rounded-2xl p-6 border border-gray-600 flex flex-col h-[30rem] justify-between bg-[#191919]">
      <div className="relative h-1/2 rounded-lg overflow-hidden">
        <CldImage
          src={`nextblog/blogs/${blogid}_${category}_${userid}`}
          alt={title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <Button>{category}</Button>
      <h3 className="text-xl font-medium line-clamp-3 w-4/5 min-h-20 font-[Degular Variable Text]">
        {title}
      </h3>
      <User src={`nextblog/authors/${userid}`} name={name} date={date} end />
    </div>
  );
};

export default function BlogGrid({ blogs }: { blogs: BlogType[] }) {
  return (
    <div className="grid grid-cols-3 gap-8 px-4">
      {blogs.map((blog) => (
        <Card
          key={blog.title}
          blogid={blog.blogid}
          title={blog.title}
          date={blog.date}
          category={blog.category}
          userid={blog.userid}
          name={blog.name}
        />
      ))}
    </div>
  );
}
