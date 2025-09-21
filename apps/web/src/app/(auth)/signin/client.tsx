"use client";

import { z } from "zod/v3";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { signinSchema } from "@/lib/schemas/auth";
import { ForgetPassword } from "./forget-password";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Eye, EyeClosed, LogIn } from "lucide-react";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";

type signUp = z.infer<typeof signinSchema>;

export const SigninClient = () => {
  const form = useForm<signUp>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const error = Object.keys(form.formState.errors).length;
    if (error) {
      setLoading(true);
      setTimeout(() => {
        toast.error("Invalid email or password");
        setLoading(false);
      }, 800);
    }
  }, [form.formState.errors]);

  const signinAuth = async (values: signUp) => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        ...values,
        callbackURL: "/",
      });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Signed in");
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
        <div className="w-4/5 md:w-1/2 xl:w-1/4 mx-auto">
          <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
            Greetings
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(signinAuth)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          maxLength={255}
                          disabled={loading}
                          required
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
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
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center mx-1">
                <ForgetPassword loading={loading} setLoading={setLoading} />
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="rememberMe"
                    className="leading-tight text-sm cursor-pointer"
                  >
                    Remember me
                  </label>
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    disabled={loading}
                    defaultChecked={form.getValues().rememberMe}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="flex flex-col ml-1">
                  <span className="opacity-70 leading-tight text-xs">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href="/signup"
                    className="underline-hover w-fit"
                    replace
                  >
                    <span className="flex items-center gap-0.5 text-sm">
                      Create
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    "..."
                  ) : (
                    <>
                      Login <LogIn className="-ml-1" />
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
