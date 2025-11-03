import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthService } from "@/core/auth/auth.service";
import { ResetPasswordForm } from "../_components/rp-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset password of your MetaPress account",
};

export default async function ResetPassword() {
  const session = await AuthService.getUserSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col xl:flex-row gap-16 2xl:gap-24 m-4 xl:m-8 p-8 pt-24 xl:pt-32 min-h-[96dvh] xl:min-h-[94dvh] border rounded-2xl bg-accent">
      <div className="space-y-4">
        <div className="text-sm text-orange-500">RESET PASSWORD</div>
        <div className="text-3xl lg:text-4xl xl:text-5xl tracking-tighter w-xs lg:w-sm xl:w-md">
          Just a reminder that this action can&apos;t be undone. Also, this link
          is valid only for 1 hour
        </div>
      </div>
      <div className="xl:w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
