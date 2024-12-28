import Button from "@/components/button";
import Image from "next/image";
import User from "@/app/components/user";

export default function Carousel() {
  return (
    <div className="relative h-[550px]">
      <Image
        src="/images/urban-gardening/urban-gardening-1.jpg"
        alt="Urban Gardening"
        fill={true}
        priority={true}
        className="mx-auto rounded-2xl object-cover"
      />
      <div className="absolute left-14 bottom-14 flex flex-col gap-4">
        <Button>Agriculture</Button>
        <h1 className="text-white text-4xl font-bold w-3/5">
          Discovering the Charm of Urban Gardening: A Green Oasis in the City
        </h1>
        <User
          src="/images/users/user1.jpg"
          name="John Doe"
          date="May 21, 2024"
        />
      </div>
    </div>
  );
}
