"use client";

import {
  Eye,
  Mail,
  Send,
  AtSign,
  EyeClosed,
  LockKeyhole,
  PartyPopper,
  ArrowUpRight,
  UserRoundPen,
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
import { getFirstZodError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GoogleSVG } from "@/components/google-svg";
import { GithubSVG } from "@/components/github-svg";
import { signupSchema } from "@/shared/auth/auth.schema";

export const SignupForm = () => {
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
    const name = form.get("name") as string;
    const username = form.get("username") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      signupSchema.parse({ name, username, email, password });

      const { error } = await authClient.signUp.email({
        name,
        username,
        email,
        password,
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
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.error(getFirstZodError(error));
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
            Create an account <PartyPopper className="mb-0.5" />
          </FieldLegend>
          <FieldDescription className="text-base tracking-tight text-orange-500">
            Start your journey
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  maxLength={50}
                  disabled={disabled}
                  required
                />
                <InputGroupAddon>
                  <UserRoundPen />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter an unique username"
                  maxLength={30}
                  disabled={disabled}
                  required
                />
                <InputGroupAddon>
                  <AtSign />
                </InputGroupAddon>
              </InputGroup>
            </Field>
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
                    <Send /> Create
                  </>
                )}
              </Button>
              <div className="flex flex-col items-end gap-0.5 mr-1 mt-0.5">
                <span className="opacity-70 leading-none text-sm tracking-tight">
                  Already have an account?
                </span>
                <Link
                  href="/sign-in"
                  className="border-b border-dashed border-foreground/70 w-max tracking-tight leading-tight inline-flex items-center gap-0.5"
                  replace
                >
                  Login
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
