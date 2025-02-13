"use client";

import { handleContact } from "@/actions/handleContact";
import { useActionState } from "react";

export default function Contact() {
  const [error, action, isPending] = useActionState(handleContact, null);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 lg:p-12">
      <div className="flex flex-col w-full max-w-lg gap-8">
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-3xl lg:text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-400 text-sm">
            Send us a message and we&apos;ll get back to you soon
          </p>
        </div>

        <form action={action} className="flex flex-col items-center gap-4">
          {error && (
            <div className="bg-red-800 bg-opacity-50 w-full text-wrap py-2 rounded-xl text-center">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Your Message"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
          </div>

          <button
            disabled={isPending}
            className="w-full bg-[#EEEEEE] text-[#0F0F0F] font-medium py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPending ? "Send Message" : "Sending..."}
          </button>
        </form>
      </div>
    </div>
  );
}
