import { getCldImageUrl } from "next-cloudinary";
import Image from "next/image";

export default function User({
  publicId,
  name,
  date,
}: {
  publicId: number;
  name: string;
  date: string;
  end?: boolean;
}) {
  const imgUrl = getCldImageUrl({
    src: `nextblog/authors/${publicId}`,
  });

  return (
    <div className="flex gap-2 items-center">
      <Image
        src={imgUrl}
        alt={name}
        width={42}
        height={42}
        className="rounded-full"
      />
      <div className="flex flex-col gap-1">
        <h3 className="text-white font-semibold leading-none">{name}</h3>
        <h6 className="text-gray-300 leading-none">{date}</h6>
      </div>
    </div>
  );
}
