import "server-only";
import Image from "next/image";
import type { Metadata } from "next";
import { SignupClient } from "./client";
import { titleFont } from "@/lib/static/fonts";
import Greeting from "@/public/images/circles.jpg";

export const metadata: Metadata = {
  title: "MetaPress | Signup",
  description: "Signup to MetaPress",
};

export default function Signup() {
  return (
    <div className="relative text-nowrap">
      <Image
        src={Greeting}
        alt="Background Image"
        fill
        className="dark:invert"
      />
      <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl dark:backdrop-blur-3xl">
        <div className="w-4/5 md:w-1/2 xl:w-1/4 mx-auto">
          <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
            Create Account
          </div>
          <SignupClient />
        </div>
      </div>
    </div>
  );
}
