"use client";

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod/v3";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import { notFound, useRouter, useSearchParams } from "next/navigation";

type resetPassword = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordClient = () => {
  const form = useForm<resetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = searchParams.get("token");
  if (!token) {
    notFound();
  }

  const resetPassword = async (values: resetPassword) => {
    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({ ...values, token });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Password changed");
      router.replace("/signin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(resetPassword)}
        className="flex flex-col gap-1.5"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    maxLength={255}
                    disabled={loading}
                    required
                    {...field}
                  />
                  <div className="relative">
                    {showPassword ? (
                      <Eye
                        size={16}
                        cursor="pointer"
                        className="absolute -top-5 -translate-y-1.5 right-4 stroke-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <EyeClosed
                        size={16}
                        cursor="pointer"
                        className="absolute -top-5 -translate-y-1.5 right-4 stroke-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end" disabled={loading}>
          {loading ? "..." : "Change"}
        </Button>
      </form>
    </Form>
  );
};
