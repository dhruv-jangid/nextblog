import "server-only";
import type { Metadata } from "next";
import { ContactForm } from "./_components/form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MetaPress",
};

export default function Contact() {
  return (
    <div className="flex flex-col xl:flex-row gap-16 2xl:gap-24 m-4 xl:m-8 p-8 pt-24 xl:pt-32 min-h-[96dvh] xl:min-h-[94dvh] backdrop-blur-2xl border rounded-2xl bg-accent">
      <div className="space-y-4">
        <div className="text-sm text-orange-500">TALK TO US</div>
        <div className="text-3xl lg:text-4xl xl:text-5xl tracking-tighter w-xs lg:w-sm xl:w-md">
          What&apos;s an email we can reach you out?
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
