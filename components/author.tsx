import Link from "next/link";
import fallback from "@/public/images/account.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Author = ({
  name,
  image,
  username,
}: {
  name: string;
  image: string | null;
  username: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={image ? image : fallback.src} />
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
