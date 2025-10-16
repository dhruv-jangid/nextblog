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
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import { Eye, EyeClosed, RotateCcwKey } from "lucide-react";
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
    <div className="flex flex-col xl:flex-row gap-24 m-4 xl:m-8 p-8 pt-24 xl:pt-32 min-h-[96dvh] xl:min-h-[94dvh] backdrop-blur-2xl border rounded-2xl bg-accent">
      <div className="space-y-4">
        <div className="text-sm text-orange-500">RESET PASSWORD</div>
        <div className="text-4xl xl:text-5xl tracking-tighter w-xs xl:w-md">
          Just a reminder that this action can&apos;t be undone. Also, this link
          is valid only for 1 hour
        </div>
      </div>
      <div className="xl:w-md">
        <div>NEW PASSWORD</div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(resetPassword)}
            className="space-y-2"
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
                        placeholder="Enter a strong password"
                        maxLength={255}
                        disabled={loading}
                        className="border-0 shadow-none h-24 pl-4 border-b text-xl xl:text-2xl rounded-none"
                        required
                        {...field}
                      />
                      <div className="relative">
                        {showPassword ? (
                          <Eye
                            size={16}
                            cursor="pointer"
                            className="absolute -top-6 -translate-y-1 right-4 stroke-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <EyeClosed
                            size={16}
                            cursor="pointer"
                            className="absolute -top-6 -translate-y-1 right-4 stroke-muted-foreground"
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
            <div className="flex items-center justify-end">
              <Button
                size="lg"
                type="submit"
                className="text-xl h-12 xl:w-36"
                disabled={loading}
              >
                {loading ? (
                  "..."
                ) : (
                  <>
                    Change <RotateCcwKey className="size-5 xl:size-6" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
