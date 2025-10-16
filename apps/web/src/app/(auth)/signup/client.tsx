"use client";

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod/v3";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { signupSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Eye, EyeClosed, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type signUp = z.infer<typeof signupSchema>;

export const SignupClient = () => {
  const form = useForm<signUp>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signupAuth = async (values: signUp) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({ ...values });
      if (error) {
        switch (error.code) {
          case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
            throw new Error("Username is already taken");
          case "USER_ALREADY_EXISTS":
            throw new Error("Email already registered");
          default:
            throw new Error(error.message);
        }
      }

      toast.success("Check your email for verification");
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

  const socialAuth = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.social({ provider });
      if (error) {
        throw new Error(error.message);
      }
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
    <div className="flex text-nowrap m-4 md:m-8 h-[96dvh] md:h-[94dvh] rounded-xl border overflow-hidden">
      <div className="hidden lg:block relative w-5/12 h-full">
        <Image
          src="/images/flowers.jpg"
          alt="Flowers Image"
          fill
          priority
          className="border-r object-cover brightness-90 dark:brightness-75 sepia-50"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-7/12 bg-accent">
        <div className="w-xs xl:w-md mx-auto">
          <div className="text-4xl mb-8 text-center tracking-tighter">
            Start Your Journey
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(signupAuth)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Name"
                        maxLength={50}
                        disabled={loading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Username"
                        maxLength={30}
                        disabled={loading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        maxLength={255}
                        disabled={loading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        maxLength={255}
                        disabled={loading}
                        required
                        {...field}
                      />
                    </FormControl>
                    <div className="relative">
                      {showPassword ? (
                        <Eye
                          size={16}
                          cursor="pointer"
                          className="absolute -top-6 -translate-y-1.5 right-4 stroke-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <EyeClosed
                          size={16}
                          cursor="pointer"
                          className="absolute -top-6 -translate-y-1.5 right-4 stroke-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col ml-1 mt-0.5">
                  <span className="opacity-70 leading-none text-sm tracking-tight">
                    Already have an account?
                  </span>
                  <Link
                    href="/signin"
                    className="underline underline-offset-8 decoration-dotted w-max tracking-tight"
                    replace
                  >
                    <span className="flex items-center gap-0.5">
                      Login
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </div>
                <Button
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="text-base tracking-tight"
                >
                  {loading ? (
                    "..."
                  ) : (
                    <>
                      Create <Send className="-ml-0.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-evenly w-full my-4">
            <Separator className="max-w-2/5" />
            <span className="text-muted-foreground">or</span>
            <Separator className="max-w-2/5" />
          </div>

          <div className="flex gap-4 justify-center w-full">
            <Button
              size="lg"
              disabled={loading}
              onClick={() => socialAuth("google")}
              className="text-base h-10 w-[48%]"
            >
              <Image
                src="/images/google.png"
                alt="Google's icon"
                width={18}
                height={18}
              />
              Google
            </Button>
            <Button
              size="lg"
              disabled={loading}
              onClick={() => socialAuth("github")}
              className="text-base h-10 w-[48%]"
            >
              <Image
                src="/images/github.png"
                alt="Github's icon"
                width={20}
                height={20}
                className="invert dark:invert-0"
              />
              Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
