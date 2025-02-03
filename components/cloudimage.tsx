import { getCldImageUrl } from "next-cloudinary";
import Image, { ImageProps } from "next/image";

interface CloudImageProps extends Omit<ImageProps, "src"> {
  publicId: string;
  author?: boolean;
  alt: string;
}

export const CloudImage = ({
  publicId,
  author = false,
  alt,
  ...rest
}: CloudImageProps) => {
  const url = getCldImageUrl({
    src: `nextblog/${author ? "authors" : "blogs"}/${publicId}`,
    aspectRatio: !author ? "16:9" : "1:1",
    crop: "thumb",
    gravity: `${!author ? "auto" : "center"}`,
  });

  return <Image src={url} alt={alt} {...rest} />;
};
