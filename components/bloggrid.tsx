"use client";

import Button from "@/components/button";
import User from "./user";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export interface BlogType {
  blogid: number;
  title: string;
  description: string;
  date: string;
  category: string;
  userid: number;
  username: string;
  name: string;
}

const Card = ({
  blogid,
  title,
  description,
  date,
  category,
  userid,
  username,
  name,
}: BlogType) => {
  return (
    <Link href={`/blogs/${username}/${blogid}`}>
      <div className="cursor-pointer rounded-2xl p-6 border border-gray-600 flex flex-col h-[30rem] justify-between bg-[#191919]">
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
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium line-clamp-2 w-4/5 font-[Degular Variable Text]">
            {title}
          </h3>
          <p className="line-clamp-1">{description}</p>
        </div>
        <User publicId={userid} name={name} date={date} />
      </div>
    </Link>
  );
};

export default function BlogGrid({ blogs }: { blogs: BlogType[] }) {
  return (
    <div className="grid grid-cols-3 gap-8 px-4">
      {blogs.map((blog) => (
        <Card
          key={blog.blogid}
          blogid={blog.blogid}
          title={blog.title}
          description={blog.description}
          date={blog.date}
          category={blog.category}
          userid={blog.userid}
          username={blog.username}
          name={blog.name}
        />
      ))}
    </div>
  );
}
