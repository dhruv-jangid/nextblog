"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Eye, EyeClosed } from "lucide-react";
import { getFirstZodError, credentialsValidator } from "@/lib/schemas/shared";

export const SignupClient = () => {
  const [credentials, setCredentials] = useState<{
    name: string;
    username: string;
    email: string;
    password: string;
  }>({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const credentialSignUp = async () => {
    setLoading(true);
    try {
      credentialsValidator.parse(credentials);

      const { error } = await authClient.signUp.email({
        ...credentials,
      });
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
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
      } else if (error instanceof Error) {
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
            Create Account
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              maxLength={50}
              disabled={loading}
              required
              autoFocus
              onChange={(e) =>
                setCredentials({ ...credentials, name: e.currentTarget.value })
              }
            />
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              maxLength={30}
              disabled={loading}
              required
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  username: e.currentTarget.value,
                })
              }
            />
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              maxLength={255}
              disabled={loading}
              required
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.currentTarget.value })
              }
            />
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              maxLength={255}
              disabled={loading}
              required
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.currentTarget.value,
                })
              }
            />
            <div className="relative">
              {showPassword ? (
                <Eye
                  size={16}
                  cursor="pointer"
                  className="absolute -top-7 -translate-y-1.5 right-4 stroke-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeClosed
                  size={16}
                  cursor="pointer"
                  className="absolute -top-7 -translate-y-1.5 right-4 stroke-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col ml-1">
                <div className="text-muted-foreground leading-tight text-xs">
                  Already have an account?
                </div>
                <Link href="/signin" className="underline-hover w-fit" replace>
                  <div className="flex items-center gap-0.5 text-sm">
                    Login
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </div>
              <Button disabled={loading} onClick={credentialSignUp}>
                {loading ? "..." : "Create"}
              </Button>
            </div>

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
    </div>
  );
};
