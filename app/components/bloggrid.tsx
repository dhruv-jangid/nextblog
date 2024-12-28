import Image from "next/image";
import Button from "@/components/button";
import User from "./user";

const Card = ({
  src,
  title,
  date,
  category,
}: {
  src: string;
  title: string;
  date: string;
  category: string;
}) => {
  return (
    <div className="rounded-2xl p-6 border border-gray-600 flex flex-col h-[30rem] justify-between bg-[#191919]">
      <div className="relative h-1/2 rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill={true}
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <Button>{category}</Button>
      <h3 className="text-xl font-medium line-clamp-3 w-4/5 min-h-20 font-[Degular Variable Text]">
        {title}
      </h3>
      <User src="/images/users/user1.jpg" name="John Doe" date={date} end />
    </div>
  );
};

export default function BlogGrid() {
  return (
    <div className="grid grid-cols-3 gap-8 py-10 px-4">
      <Card
        src="/images/urban-gardening/urban-gardening-1.jpg"
        title="Discovering the Charm of Urban Gardening: A Green Oasis in the City"
        date="May 21, 2024"
        category="Agriculture"
      />
      <Card
        src="/images/urban-gardening/urban-gardening-1.jpg"
        title="Discovering the Charm of Urban Gardening: A Green Oasis in the City"
        date="May 21, 2024"
        category="Agriculture"
      />
      <Card
        src="/images/urban-gardening/urban-gardening-1.jpg"
        title="Discovering the Charm of Urban Gardening: A Green Oasis in the City"
        date="May 21, 2024"
        category="Agriculture"
      />
    </div>
  );
}
