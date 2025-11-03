"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getFirstZodError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldLabel } from "@/components/ui/field";
import { forgetPasswordSchema } from "@/shared/auth/auth.schema";

export const ForgetPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;

    try {
      forgetPasswordSchema.parse({ email });

      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Check your email for password reset link");
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
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email" className="lg:text-base">
          REGISTERED EMAIL
        </FieldLabel>
        <InputGroup className="border-0 shadow-none h-24 md:px-2 border-b rounded-none bg-transparent!">
          <InputGroupInput
            type="email"
            id="email"
            name="email"
            placeholder="Enter your registered email"
            maxLength={255}
            disabled={loading}
            required
            className="text-lg md:text-lg xl:text-2xl"
          />
          <InputGroupAddon align="inline-end">
            <Mail className="size-6" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <div className="flex items-center justify-end">
        <Button
          size="lg"
          type="submit"
          className="text-lg lg:text-xl h-12 xl:w-36"
          disabled={loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Send className="size-4 lg:size-5" /> Verify
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
