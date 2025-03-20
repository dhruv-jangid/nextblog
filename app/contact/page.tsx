"use client";

import { handleContact } from "@/actions/handleContact";
import { useActionState } from "react";

export default function Contact() {
  const [error, action, isPending] = useActionState(handleContact, null);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 lg:p-12">
      <div className="flex flex-col w-full max-w-lg gap-8">
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-3xl lg:text-4xl font-bold text-rose-300">
            Contact Us
          </h1>
          <p className="text-neutral-400 tracking-tight text-lg">
            Send us a message and we&apos;ll get back to you soon
          </p>
        </div>

        <form
          action={action}
          className="flex flex-col items-center gap-4 tracking-tight"
        >
          {error && (
            <div className="px-5 py-2.5 leading-tight text-red-500 bg-red-500/10 border border-red-500/50 rounded-4xl">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-3 w-full">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Subject"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isPending}
            />
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Message"
              className="w-full py-4 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              required
              disabled={isPending}
            />
          </div>

          <button
            disabled={isPending}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-lg font-semibold py-2.5 leading-tight rounded-4xl cursor-pointer transition-all hover:-translate-y-1 hover:translate-x-1 ease-out duration-300 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!isPending ? "Send Message" : "Sending..."}
          </button>
        </form>
      </div>
    </div>
  );
}
