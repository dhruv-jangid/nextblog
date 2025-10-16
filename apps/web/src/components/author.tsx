import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Author = ({
  name,
  image,
  username,
}: {
  name: string;
  image: string | undefined;
  username: string;
}) => {
  return (
    <div className="flex gap-2.5 items-center">
      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name[0].toUpperCase() || "M"}</AvatarFallback>
      </Avatar>
      <Link
        href={`/${username}`}
        className="font-medium max-w-3xs truncate tracking-tight hover:animate-pulse"
      >
        {name}
      </Link>
    </div>
  );
};
