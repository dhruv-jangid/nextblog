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
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { signupSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Eye, EyeClosed, Send } from "lucide-react";

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
    <div className="relative text-nowrap">
      <Image
        src="/images/circles.jpg"
        alt="Background Image"
        fill
        className="dark:invert"
      />

      <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl dark:backdrop-blur-3xl">
        <div className="w-4/5 md:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
          <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex flex-col ml-1">
                  <div className="text-muted-foreground leading-tight text-xs">
                    Already have an account?
                  </div>
                  <Link
                    href="/signin"
                    className="underline-hover w-fit"
                    replace
                  >
                    <div className="flex items-center gap-0.5 text-sm">
                      Login
                      <ArrowUpRight size={20} />
                    </div>
                  </Link>
                </div>
                <Button type="submit" disabled={loading}>
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

          <div className="flex items-center justify-evenly w-full my-3.5">
            <hr className="w-2/5" />
            <span>or</span>
            <hr className="w-2/5" />
          </div>

          <div className="flex flex-col gap-2.5 justify-center w-full">
            <Button disabled={loading} onClick={() => socialAuth("google")}>
              <Image
                src="/images/google.png"
                alt="Google's icon"
                width={16}
                height={16}
              />
              Continue with Google
            </Button>
            <Button disabled={loading} onClick={() => socialAuth("github")}>
              <Image
                src="/images/github.png"
                alt="Github's icon"
                width={18}
                height={18}
                className="invert dark:invert-0"
              />
              Continue with Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
