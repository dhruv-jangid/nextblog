"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { getFirstZodError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CornerDownRight, Mail } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { contactUser } from "@/core/common/common.actions";
import { contactUserSchema } from "@/shared/common/common.schema";

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;

    try {
      contactUserSchema.parse({ email });

      await contactUser({ email });

      toast.success("We will contact you back shortly.");
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
    <form onSubmit={handleFormSubmit} className="space-y-4 xl:w-md">
      <Field>
        <FieldLabel htmlFor="email" className="lg:text-base">
          EMAIL ADDRESS
        </FieldLabel>
        <InputGroup className="border-0 shadow-none h-24 md:px-2 border-b rounded-none bg-transparent!">
          <InputGroupInput
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
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
              <CornerDownRight className="size-4 lg:size-5" /> Submit
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
