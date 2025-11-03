import Link from "next/link";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { ArrowUpRight } from "lucide-react";

export const Grid = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 xl:gap-10 p-4 md:p-8">
      {blogs.map(({ id, title, cover, category, createdAt, author }) => {
        return (
          <div key={id} className="flex rounded-xl border overflow-hidden">
            <div className="relative aspect-7/12 min-w-36 md:min-w-40 lg:min-w-36 xl:min-w-48">
              <Image
                src={cover}
                alt={title}
                fill
                priority={false}
                placeholder="empty"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover border-r"
              />
            </div>

            <div className="inline-flex flex-col justify-between p-6 bg-accent min-h-72 md: w-full">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5 text-sm">
                  <time>
                    {new Intl.DateTimeFormat("en-GB", {
                      month: "short",
                      day: "2-digit",
                      year: "2-digit",
                    }).format(new Date(createdAt))}
                  </time>
                  <Badge>{category}</Badge>
                </div>

                <span className="line-clamp-2 text-2xl max-w-xs font-medium tracking-tighter">
                  {title}
                </span>

                <Link
                  href={`/${author.username}/${id}`}
                  className="inline-flex items-center gap-1 text-lg mt-3 underline underline-offset-4 decoration-dotted tracking-tight"
                >
                  Read <ArrowUpRight size={14} />
                </Link>
              </div>

              <span className="truncate text-sm">
                by{" "}
                <Link
                  href={`/${author.username}`}
                  className="inline-flex items-center gap-0.5 font-medium underline underline-offset-4 decoration-dotted opacity-70 tracking-tight"
                >
                  {author.name} <ArrowUpRight size={12} />
                </Link>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
