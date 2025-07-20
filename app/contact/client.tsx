"use client";

import { useState } from "react";
import { ZodError } from "zod/v4";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { contactUser } from "@/actions/handleUser";
import { contactValidator, getFirstZodError } from "@/lib/schemas/shared";

export const ContactClient = () => {
  const [details, setDetails] = useState<{
    subject: string;
    message: string;
  }>({ subject: "", message: "" });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        className="w-full rounded-xl py-2.5 px-5 leading-tight border focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        id="subject"
        name="subject"
        placeholder="Subject"
        maxLength={50}
        disabled={loading}
        required
        autoFocus
        onChange={(e) =>
          setDetails({
            ...details,
            subject: e.currentTarget.value,
          })
        }
      />
      <textarea
        className="w-full rounded-xl py-4 px-5 leading-tight min-h-52 border focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        id="message"
        name="message"
        placeholder="Message"
        maxLength={255}
        disabled={loading}
        required
        onChange={(e) =>
          setDetails({
            ...details,
            message: e.currentTarget.value,
          })
        }
      />
      <div className="flex justify-end items-center">
        <Button
          variant="outline"
          disabled={loading}
          className="text-base py-5 px-6"
          onClick={async () => {
            setLoading(true);
            try {
              contactValidator.parse(details);

              await contactUser(details);
            } catch (error) {
              if (error instanceof ZodError) {
                toast({ title: getFirstZodError(error) });
              } else if (error instanceof Error) {
                toast({ title: error.message });
              } else {
                toast({ title: "Something went wrong" });
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
};
