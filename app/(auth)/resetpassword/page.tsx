import "server-only";
import type { Metadata } from "next";
import { ResetPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Reset Password",
  description: "Reset password of MetaPress account",
};

export default function ResetPassword() {
  return (
    <div className="flex flex-col h-[92dvh] justify-center items-end gap-1 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
      <ResetPasswordClient />
      <p className="self-center opacity-50 text-center mt-12 text-sm tracking-wide">
        *Link is valid only for 1 hour*
      </p>
    </div>
  );
}
