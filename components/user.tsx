import { CldImage } from "next-cloudinary";
import Image from "next/image";

export default function User({
  src,
  name,
  date,
  end,
}: {
  src: string;
  name: string;
  date: string;
  end?: boolean;
}) {
  return (
    <>
      {end ? (
        <div className="flex gap-2 items-center self-end">
          <div className="flex flex-col gap-1 mt-0.5">
            <h3 className="text-white font-semibold leading-none self-end">
              {name}
            </h3>
            <h6 className="text-gray-300 leading-none self-end">{date}</h6>
          </div>
          <CldImage
            src={src}
            alt={name}
            width={42}
            height={42}
            className="rounded-full"
          />
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Image
            src={src}
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
      )}
    </>
  );
}
