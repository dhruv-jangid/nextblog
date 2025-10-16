import Link from "next/link";
import Image from "next/image";

export const Grid2 = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[repeat(4,auto)] justify-center rounded-xl overflow-hidden">
      {blogs.map(({ id, title, image, slug, user }) => {
        return (
          <div
            key={id}
            className="relative flex flex-col h-96 w-96 justify-end outline group overflow-hidden"
          >
            <Link
              href={`/${user!.username}/${slug}`}
              className="relative block h-full"
            >
              <Image
                src={image!}
                alt={title!}
                fill
                priority={false}
                placeholder="empty"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="cursor-pointer object-cover"
              />
              <div className="absolute inset-0 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 w-full text-center line-clamp-3 transition-all duration-200 translate-y-8 group-hover:translate-y-0 backdrop-blur-xl group-hover:bg-black/20 text-lg text-balance">
                {title}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
