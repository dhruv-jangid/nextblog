"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { emailValidator, getFirstZodError } from "@/lib/schemas/shared";

export const SigninClient = () => {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    rememberMe: boolean;
  }>({ email: "", password: "", rememberMe: true });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const credentialSignIn = async () => {
    setLoading(true);
    try {
      emailValidator.parse(credentials.email);

      const { error } = await authClient.signIn.email({
        ...credentials,
        callbackURL: "/",
      });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Signed in");
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
            Greetings
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              maxLength={255}
              disabled={loading}
              required
              autoFocus
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
                  className="absolute -top-8 -translate-y-0.5 right-4 stroke-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <EyeClosed
                  size={16}
                  cursor="pointer"
                  className="absolute -top-8 -translate-y-0.5 right-4 stroke-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <div className="flex justify-between items-center mx-1 -mt-1.5 mb-3.5">
              <ForgetPassword />
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="rememberMe"
                  className="leading-tight text-sm cursor-pointer"
                >
                  Remember me
                </label>
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  name="rememberMe"
                  id="rememberMe"
                  defaultChecked={credentials.rememberMe}
                  onChange={() =>
                    setCredentials({
                      ...credentials,
                      rememberMe: !credentials.rememberMe,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col ml-1">
                <div className="opacity-70 leading-tight text-xs">
                  Don&apos;t have an account?
                </div>
                <Link href="/signup" className="underline-hover w-fit" replace>
                  <div className="flex items-center gap-0.5 text-sm">
                    Create
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </div>
              <Button disabled={loading} onClick={credentialSignIn}>
                {loading ? "..." : "Login"}
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
                  className="object-cover"
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

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");

  const forgetPassword = async () => {
    setLoading(true);
    try {
      emailValidator.parse(email);

      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/resetpassword",
      });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Check your email for password reset link");
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
      setEmail("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-sm text-muted-foreground underline underline-offset-4 cursor-pointer">
        Forget password?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your registered email</DialogTitle>
          <DialogDescription>
            A reset password link will be sent to this email
          </DialogDescription>
        </DialogHeader>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          autoFocus
          maxLength={255}
          disabled={loading}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button disabled={loading || !email.trim()} onClick={forgetPassword}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
