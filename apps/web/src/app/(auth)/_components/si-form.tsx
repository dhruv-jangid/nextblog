"use client";

import {
  Eye,
  Mail,
  LogIn,
  Rocket,
  EyeClosed,
  LockKeyhole,
  ArrowUpRight,
} from "lucide-react";
import {
  Field,
  FieldSet,
  FieldLabel,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleSVG } from "@/components/google-svg";
import { GithubSVG } from "@/components/github-svg";
import { signInSchema } from "@/shared/auth/auth.schema";

export const SigninForm = () => {
  const [loading, setLoading] = useState({
    form: false,
    google: false,
    github: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const disabled = Object.values(loading).some(Boolean);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, form: true }));

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const rememberMe = form.get("rememberme") === "on";

    try {
      signInSchema.parse({ email, password, rememberMe });

      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/",
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.error("Invalid email or password");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleOAuth = async (provider: OAuth) => {
    setLoading((prev) => ({ ...prev, [provider]: true }));

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
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <FieldGroup className="w-xs xl:w-md mx-auto">
      <form onSubmit={handleFormSubmit}>
        <FieldSet>
          <FieldLegend className="text-2xl! tracking-tight inline-flex items-center gap-2">
            Login to MetaPress <Rocket />
          </FieldLegend>
          <FieldDescription className="text-base tracking-tight text-orange-500">
            Express your creativity
          </FieldDescription>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  maxLength={255}
                  disabled={disabled}
                  required
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel
                htmlFor="password"
                className="justify-between items-start pr-1"
              >
                Password
                <Link
                  href="/forget-password"
                  className="underline underline-offset-2 decoration-dashed opacity-80 tracking-tight"
                >
                  Forget password?
                </Link>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter a strong password"
                  maxLength={255}
                  disabled={disabled}
                  required
                />
                <InputGroupAddon>
                  <LockKeyhole />
                </InputGroupAddon>
                <InputGroupAddon
                  align="inline-end"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <FieldGroup className="gap-3">
            <Field orientation="horizontal" className="ml-0.5 opacity-80">
              <Checkbox
                id="rememberme"
                name="rememberme"
                disabled={disabled}
                defaultChecked
              />
              <label
                htmlFor="rememberme"
                className="leading-tight text-sm mt-[0.1rem]"
              >
                Remember me
              </label>
            </Field>
            <Field orientation="horizontal" className="justify-between">
              <Button
                variant="outline"
                type="submit"
                disabled={disabled}
                className="px-4!"
              >
                {loading.form ? (
                  <Spinner />
                ) : (
                  <>
                    <LogIn className="-ml-0.5" /> Log in
                  </>
                )}
              </Button>
              <div className="flex flex-col items-end gap-0.5 mr-1 mt-0.5">
                <span className="opacity-70 leading-none text-sm tracking-tight">
                  Don&apos;t have an account?
                </span>
                <Link
                  href="/sign-up"
                  className="border-b border-dashed border-foreground/70 w-max tracking-tight leading-tight inline-flex items-center gap-0.5"
                  replace
                >
                  Create
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>

      <FieldSeparator className="w-[98%] mx-auto">or</FieldSeparator>

      <FieldSet>
        <div className="flex gap-4 justify-center w-full">
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => handleOAuth("google")}
            className="w-[48%]"
          >
            {loading.google ? (
              <Spinner />
            ) : (
              <>
                <GoogleSVG />
                Google
              </>
            )}
          </Button>
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => handleOAuth("github")}
            className="w-[48%]"
          >
            {loading.github ? (
              <Spinner />
            ) : (
              <>
                <GithubSVG />
                Github
              </>
            )}
          </Button>
        </div>
      </FieldSet>
    </FieldGroup>
  );
};
