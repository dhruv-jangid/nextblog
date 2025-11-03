import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthService } from "@/core/auth/auth.service";
import { ForgetPasswordForm } from "../_components/fp-form";

export const metadata: Metadata = {
  title: "Forget Password",
  description: "Recover password of your MetaPress account",
};

export default async function ForgetPassword() {
  const session = await AuthService.getUserSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col xl:flex-row gap-16 2xl:gap-24 m-4 xl:m-8 p-8 pt-24 xl:pt-32 min-h-[96dvh] xl:min-h-[94dvh] border rounded-2xl bg-accent">
      <div className="space-y-4">
        <div className="text-sm text-orange-500">FORGET PASSWORD</div>
        <div className="text-3xl lg:text-4xl xl:text-5xl tracking-tighter w-xs lg:w-sm xl:w-md">
          Verify your identity to recover your account. Just a moment, this
          won&apos;t take time.
        </div>
      </div>
      <div className="xl:w-md">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
