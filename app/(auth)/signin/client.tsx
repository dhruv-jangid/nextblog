"use client";

import {
  socialAuth,
  forgetPassword,
  credentialSignIn,
} from "@/actions/handleAuth";
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
import { useState } from "react";
import { ZodError } from "zod/v4";
import { Input } from "@/components/ui/input";
import Google from "@/public/images/google.png";
import Github from "@/public/images/github.png";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { ArrowUpRight, Eye, EyeClosed } from "lucide-react";
import { emailValidator, getFirstZodError } from "@/lib/schemas/shared";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const SigninClient = () => {
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    rememberMe: boolean;
  }>({ email: "", password: "", rememberMe: true });
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();
  const [fpEmail, setFpEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  return (
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
            size={18}
            cursor="pointer"
            className="absolute -top-11 translate-y-1.5 right-4"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <EyeClosed
            size={18}
            cursor="pointer"
            className="absolute -top-10 translate-y-0.5 right-4"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <div className="flex justify-between items-center mx-1 -mt-1.5 mb-3.5">
        <Dialog>
          <DialogTrigger className="text-sm opacity-70 underline cursor-pointer">
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
              maxLength={255}
              disabled={loading}
              onChange={(e) => setFpEmail(e.currentTarget.value)}
            />
            <DialogFooter>
              <Button
                disabled={loading}
                className="text-base py-5 px-6"
                onClick={async () => {
                  setLoading(true);
                  try {
                    emailValidator.parse(fpEmail);

                    await forgetPassword({ email: fpEmail });

                    success({
                      title: "Check your email for password reset link",
                    });
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
                }}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex items-center gap-1.5">
          <label htmlFor="rememberMe" className="leading-tight cursor-pointer">
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
          <div className="opacity-70 leading-tight text-sm">
            Don&apos;t have an account?
          </div>
          <Link href="/signup" className="underline-hover w-fit" replace>
            <div className="flex items-center gap-0.5">
              Create
              <ArrowUpRight size={20} />
            </div>
          </Link>
        </div>
        <Button
          size="lg"
          disabled={loading}
          className="text-base"
          onClick={async () => {
            setLoading(true);
            try {
              emailValidator.parse(credentials.email);

              await credentialSignIn(credentials);
            } catch (error) {
              if (error instanceof ZodError) {
                errorToast({ title: getFirstZodError(error) });
              } else if (isRedirectError(error)) {
                success({ title: "Signed in" });
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
          {loading ? "..." : "Login"}
        </Button>
      </div>

      <div className="flex items-center justify-evenly w-full my-3.5">
        <hr className="w-2/5" />
        <span>or</span>
        <hr className="w-2/5" />
      </div>

      <div className="flex flex-col gap-2.5 justify-center w-full">
        <Button
          size="lg"
          disabled={loading}
          className="w-full text-base"
          onClick={async () => {
            setLoading(true);
            try {
              await socialAuth({ provider: "google" });
            } catch (error) {
              if (error instanceof Error) {
                errorToast({ title: error.message });
              } else {
                errorToast({ title: "Something went wrong" });
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          <Image
            src={Google}
            alt="Google's icon"
            width={16}
            height={16}
            className="object-cover"
          />
          Continue with Google
        </Button>
        <Button
          size="lg"
          disabled={loading}
          className="w-full text-base"
          onClick={async () => {
            setLoading(true);
            try {
              await socialAuth({ provider: "github" });
            } catch (error) {
              if (error instanceof Error) {
                errorToast({ title: error.message });
              } else {
                errorToast({ title: "Something went wrong" });
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          <Image
            src={Github}
            alt="Github's icon"
            width={18}
            height={18}
            className="invert dark:invert-0"
          />
          Continue with Github
        </Button>
      </div>
    </div>
  );
};
