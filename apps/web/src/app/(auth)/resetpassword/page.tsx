import "server-only";
import type { Metadata } from "next";
import { ResetPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Reset Password",
  description: "Reset password of your MetaPress account",
};

export default function ResetPassword() {
  return (
    <div className="flex flex-col h-[92dvh] justify-center gap-12 w-4/5 md:w-1/2 xl:w-1/4 mx-auto">
      <ResetPasswordClient />
      <p className="self-center text-muted-foreground text-center text-sm tracking-wide">
        *Link is valid only for 1 hour*
      </p>
    </div>
  );
}
