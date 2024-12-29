import Image from "next/image";
import Button from "@/components/button";
import User from "./user";

const Card = ({
  blogImage,
  blogTitle,
  blogDate,
  blogCategory,
  userName,
  userImage,
}: {
  blogImage: string;
  blogTitle: string;
  blogDate: string;
  blogCategory: string;
  userName: string;
  userImage: string;
}) => {
  return (
    <div className="rounded-2xl p-6 border border-gray-600 flex flex-col h-[30rem] justify-between bg-[#191919]">
      <div className="relative h-1/2 rounded-lg overflow-hidden">
        <Image
          src={blogImage}
          alt={blogTitle}
          fill={true}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <Button>{blogCategory}</Button>
      <h3 className="text-xl font-medium line-clamp-3 w-4/5 min-h-20 font-[Degular Variable Text]">
        {blogTitle}
      </h3>
      <User src={userImage} name={userName} date={blogDate} end />
    </div>
  );
};

export default function BlogGrid({
  blogs,
}: {
  blogs: {
    blogImage: string;
    blogTitle: string;
    blogDate: string;
    blogCategory: string;
    userName: string;
    userImage: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-8 px-4">
      {blogs.map((blog) => (
        <Card
          blogImage={blog.blogImage}
          blogTitle={blog.blogTitle}
          blogDate={blog.blogDate}
          blogCategory={blog.blogCategory}
          userName={blog.userName}
          userImage={blog.userImage}
          key={blog.blogTitle}
        />
      ))}
    </div>
  );
}
