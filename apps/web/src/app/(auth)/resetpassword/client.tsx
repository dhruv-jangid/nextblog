"use client";

import { ZodError } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toastProvider";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { getFirstZodError, passwordValidator } from "@/lib/schemas/shared";

export const ResetPasswordClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token");
  if (!token) {
    notFound();
  }

  const resetPassword = async () => {
    setLoading(true);
    try {
      passwordValidator.parse(newPassword);

      const { error } = await authClient.resetPassword({ newPassword, token });
      if (error) {
        throw new Error(error.message);
      }

      success({ title: "Password changed" });
      router.replace("/signin");
    } catch (error) {
      if (error instanceof ZodError) {
        errorToast({ title: getFirstZodError(error) });
      } else if (error instanceof Error) {
        errorToast({ title: error.message });
      } else {
        errorToast({ title: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[92dvh] justify-center items-end gap-1 w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto">
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        placeholder="Password"
        maxLength={255}
        disabled={loading}
        required
        onChange={(e) => setNewPassword(e.currentTarget.value)}
      />
      <div className="relative">
        {showPassword ? (
          <Eye
            size={18}
            cursor="pointer"
            className="absolute -top-8 translate-y-0.5 right-4 stroke-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <EyeClosed
            size={18}
            cursor="pointer"
            className="absolute -top-8 translate-y-0.5 right-4 stroke-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <Button
        variant="secondary"
        className="mt-1"
        disabled={loading || !newPassword.trim()}
        onClick={resetPassword}
      >
        Change password
      </Button>
      <p className="self-center text-muted-foreground text-center mt-12 text-sm tracking-wide">
        *Link is valid only for 1 hour*
      </p>
    </div>
  );
};
