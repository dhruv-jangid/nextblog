import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResetPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Reset Password",
  description: "Reset password of your MetaPress account",
};

export default async function ResetPassword() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-[92dvh] justify-center gap-12 w-4/5 md:w-1/2 xl:w-1/4 mx-auto">
      <ResetPasswordClient />
      <p className="self-center text-muted-foreground text-center text-sm tracking-wide">
        *Link is valid only for 1 hour*
      </p>
    </div>
  );
}
