import "server-only";
import Image from "next/image";
import type { Metadata } from "next";
import { ContactClient } from "./client";
import { titleFont } from "@/lib/static/fonts";
import Greeting from "@/public/images/circles.jpg";

export const metadata: Metadata = {
  title: "MetaPress | Contact",
  description: "Contact MetaPress",
};

export default function Signup() {
  return (
    <div className="relative dark:text-accent">
      <Image src={Greeting} alt="" fill />
      <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl">
        <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
          <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
            Talk to us
          </div>
          <ContactClient />
        </div>
      </div>
    </div>
  );
}
