"use client";

import { ZodError } from "zod";
import Image from "next/image";
import { useState } from "react";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { contactUser } from "@/actions/handleUser";
import Greeting from "@/public/images/circles.jpg";
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
    <div className="relative">
      <Image
        src={Greeting}
        alt="Background Image"
        fill
        className="dark:invert"
      />
      <div className="flex flex-col items-center justify-center w-full min-h-[92dvh] backdrop-blur-2xl">
        <div className="w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
          <div className={`${titleFont.className} text-3xl mb-6 text-center`}>
            Talk to us
          </div>
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
                onClick={handleContactUser}
              >
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
