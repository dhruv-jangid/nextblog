import Link from "next/link";
import Image from "next/image";

export const UserGrid = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="grid grid-cols-3 2xl:grid-cols-4 gap-1 lg:border lg:rounded-2xl overflow-hidden">
      {blogs.map(({ id, title, cover, author }) => {
        return (
          <div
            key={id}
            className="relative flex flex-col aspect-square justify-end outline group overflow-hidden"
          >
            <Link
              href={`/${author.username}/${id}`}
              className="relative block h-full"
            >
              <Image
                src={cover!}
                alt={title!}
                fill
                priority={false}
                placeholder="empty"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                className="cursor-pointer object-cover"
              />
              <div className="absolute inset-0 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 w-full text-center line-clamp-3 transition-all duration-200 translate-y-8 group-hover:translate-y-0 backdrop-blur-xl group-hover:bg-black/20 text-lg text-balance px-2">
                {title}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
