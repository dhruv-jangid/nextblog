import { Button } from "@/components/button";
import { Author } from "@/components/author";
import type { BlogWithAuthor } from "@/app/createblog/page";
import Link from "next/link";
import { CloudImage } from "@/components/cloudimage";

const Card: React.FC<BlogWithAuthor> = ({
  id,
  title,
  createdAt,
  category,
  authorId,
  slug,
  author: { slug: username, name },
}) => {
  return (
    <div className="rounded-2xl p-6 border border-gray-600 flex flex-col h-[25rem] lg:h-[28rem] justify-between bg-gradient-to-br from-[#191919] from-40% to-transparent">
      <div className="relative h-1/2 rounded-lg overflow-hidden">
        <CloudImage
          publicId={id}
          alt={title}
          fill={true}
          priority={false}
          placeholder="empty"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="cursor-pointer object-cover"
        />
      </div>
      <Button>
        <Link href={`/blogs/${category}`} className="text-sm md:text-md">
          {category}
        </Link>
      </Button>
      <h3 className="cursor-pointer text-xl font-medium line-clamp-3 w-10/12 font-[Degular Variable Text]">
        <Link
          href={`/${username}/${slug}`}
          className="line-clamp-2 lg:line-clamp-3"
        >
          {title}
        </Link>
      </h3>
      <Author
        publicId={authorId}
        name={name}
        slug={username}
        date={createdAt}
        end
      />
    </div>
  );
};

export const BlogGrid: React.FC<{
  blogs: BlogWithAuthor[];
}> = ({ blogs }) => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 px-4 lg:px-8">
      {blogs.map((blog) => (
        <Card key={blog.id} {...blog} />
      ))}
    </div>
  );
};
