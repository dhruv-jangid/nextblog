"use client";

import Image from "next/image";
import Logo from "@/app/favicon.ico";
import { useRouter } from "next/navigation";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-[92dvh] flex flex-col items-center justify-center text-center">
      <Image
        src={Logo}
        width={120}
        height={120}
        priority
        quality={100}
        alt="logo"
        className="mb-4 dark:invert"
      />
      <h2 className={`${titleFont.className} text-4xl font-medium mb-2`}>
        Page Not Found
      </h2>
      <p className="text-lg opacity-50 mb-6">
        Sorry, couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button variant="secondary" onClick={() => router.replace("/")}>
        Return Home
      </Button>
    </div>
  );
}
