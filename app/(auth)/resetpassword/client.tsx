"use client";

import { ZodError } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { resetPassword } from "@/actions/handleAuth";
import { notFound, useSearchParams } from "next/navigation";
import { getFirstZodError, passwordValidator } from "@/lib/schemas/shared";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const ResetPasswordClient = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token");
  if (!token) {
    notFound();
  }

  return (
    <>
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
            className="absolute -top-10 translate-y-2 right-4"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <EyeClosed
            size={18}
            cursor="pointer"
            className="absolute -top-10 translate-y-2 right-4"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <Button
        className="mt-1"
        onClick={async () => {
          setLoading(true);
          try {
            passwordValidator.parse(newPassword);

            await resetPassword({ newPassword, token });
          } catch (error) {
            if (error instanceof ZodError) {
              errorToast({ title: getFirstZodError(error) });
            } else if (isRedirectError(error)) {
              success({ title: "Password changed" });
            } else if (error instanceof Error) {
              errorToast({ title: error.message });
            } else {
              errorToast({ title: "Something went wrong" });
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        Change password
      </Button>
    </>
  );
};
