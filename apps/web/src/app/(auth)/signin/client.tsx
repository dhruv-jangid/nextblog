"use client";

import { z } from "zod/v3";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { signinSchema } from "@/lib/schemas/auth";
import { ForgetPassword } from "./forget-password";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Eye, EyeClosed, LogIn } from "lucide-react";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

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
            Greetings!
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
              <div className="flex justify-between items-center mt-8">
                <div className="flex flex-col ml-1 mt-1">
                  <span className="opacity-70 leading-none text-sm tracking-tight">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href="/signup"
                    className="underline underline-offset-4 decoration-dotted w-max tracking-tight"
                    replace
                  >
                    <span className="flex items-center gap-0.5">
                      Create
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
                      Login <LogIn className="-ml-1" />
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
