"use client";

import { ZodError } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { contactUser } from "@/actions/handleUser";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/providers/toastProvider";
import { contactValidator, getFirstZodError } from "@/lib/schemas/shared";

export const ContactClient = () => {
  const [details, setDetails] = useState<{
    subject: string;
    message: string;
  }>({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleContactUser = async () => {
    setLoading(true);
    try {
      contactValidator.parse(details);

      await contactUser(details);
      success({ title: "We've received your inquiry" });
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
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl">
      <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
        <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
          Talk to us
        </div>
        <div className="flex flex-col gap-2">
          <Input
            type="text"
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
          <Textarea
            className="min-h-52 resize-none"
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
          <Button
            variant="outline"
            disabled={loading}
            className="self-end"
            onClick={handleContactUser}
          >
            {loading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};
