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
    aspectRatio: `${author ? "1:1" : "16:9"}`,
    crop: "fill",
    gravity: `${author ? "center" : "auto"}`,
  });

  return <Image src={url} alt={alt} {...rest} />;
};
