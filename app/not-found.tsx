"use client";

import { Button } from "@/components/button";
import Image from "next/image";
import logo from "@/app/favicon.ico";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-[80dvh] flex flex-col items-center justify-center text-center">
      <Image src={logo} width={120} height={120} alt="logo" className="mb-4" />
      <h2 className="text-4xl font-bold mb-2 text-rose-300">Page Not Found</h2>
      <p className="text-lg text-neutral-400 mb-6">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button
        onClick={() => {
          router.replace("/");
        }}
      >
        Return Home
      </Button>
    </div>
  );
}
