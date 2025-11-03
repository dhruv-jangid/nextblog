import "server-only";
import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "../_components/su-form";
import { AuthService } from "@/core/auth/auth.service";

export const metadata: Metadata = {
  title: "Signup",
  description: "Create an account on MetaPress",
};

export default async function Signup() {
  const session = await AuthService.getUserSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex m-4 md:m-8 h-[96dvh] md:h-[94dvh] rounded-xl border overflow-hidden">
      <div className="hidden lg:block relative w-5/12 h-full">
        <Image
          src="/images/flowers.jpg"
          alt="Flowers Image"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="border-r object-cover brightness-90 dark:brightness-75 sepia-50"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-7/12 bg-accent">
        <SignupForm />
      </div>
    </div>
  );
}
