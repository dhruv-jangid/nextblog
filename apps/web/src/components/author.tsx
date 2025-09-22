import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Author = ({
  name,
  image,
  username,
}: {
  name: string;
  image: string | null | undefined;
  username: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={image ? image : "/images/account.png"} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <Link
        href={`/${username}`}
        className="font-medium line-clamp-1 underline-hover hover:animate-pulse"
      >
        {name}
      </Link>
    </div>
  );
};
