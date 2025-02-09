import Link from "next/link";
import Image from "next/image";

export const Author = ({ name, image, slug, date, end = false }) => {
  return (
    <div
      className={`flex gap-3 items-center ${
        end ? "justify-end text-end" : "justify-start text-start"
      }`}
    >
      {!end && (
        <Link
          href={`/${slug}`}
          className="hover:opacity-80 w-11 h-11 lg:w-12 lg:h-12 relative"
        >
          <Image
            src={image}
            alt={name}
            fill
            priority={true}
            sizes="(min-width: 768px) 44px"
            className="rounded-full"
          />
        </Link>
      )}
      <div className="flex flex-col gap-1 md:gap-0 lg:text-lg">
        <Link href={`/${slug}`} className="hover:opacity-80">
          <h3 className="text-white font-medium leading-none">{name}</h3>
        </Link>
        <h6 className="text-gray-300 leading-none text-sm md:text-base">
          {new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </h6>
      </div>
      {end && (
        <Link
          href={`/${slug}`}
          className="hover:opacity-80 w-11 h-11 lg:w-12 lg:h-12 relative"
        >
          <Image
            src={image}
            alt={name}
            fill
            priority={true}
            sizes="(min-width: 768px) 44px"
            className="rounded-full"
          />
        </Link>
      )}
    </div>
  );
};
