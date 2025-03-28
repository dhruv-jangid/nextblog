import Link from "next/link";
import Image from "next/image";
import Account from "@/public/images/account.png";

export const Author = ({
  name,
  image,
  slug,
  date,
}: {
  name: string;
  image: string | null;
  slug: string;
  date: Date;
}) => {
  return (
    <div className="flex gap-3 items-center tracking-tight">
      <Link
        href={`${slug}`}
        className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-full hover:animate-pulse overflow-hidden"
      >
        <Image
          src={image || Account}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 44px"
        />
      </Link>
      <div className="flex flex-col gap-0.5 lg:text-lg">
        <Link
          href={`/${slug}`}
          className="text-rose-300 font-medium leading-none line-clamp-1 hover:underline hover:animate-pulse underline-offset-2"
        >
          {name}
        </Link>
        <p className="text-neutral-400 leading-none text-sm md:text-base cursor-default">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(date))}
        </p>
      </div>
    </div>
  );
};
