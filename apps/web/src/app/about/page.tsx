import "server-only";
import Link from "next/link";
import type { Metadata } from "next";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "MetaPress | About",
  description: "About MetaPress",
};

export default function About() {
  return (
    <div className="min-h-[92dvh] flex flex-col items-center text-balance">
      <div
        className={`${titleFont.className} w-full text-center text-lg border-b py-12`}
      >
        <h1 className="text-3xl lg:text-4xl font-semibold">MetaPress</h1>
        <p>The Pulse of Creativity</p>
      </div>

      <div className="py-16 px-16 lg:px-64 border-b w-full">
        <h2 className={`${titleFont.className} text-2xl font-medium mb-2.5`}>
          Our Mission
        </h2>
        <p className="text-lg leading-snug">
          MetaPress is a platform dedicated to empowering writers, thinkers, and
          creators to share their stories with the world. We believe in the
          power of words to inspire, educate, and connect people across
          boundaries.
        </p>
      </div>

      <div className="flex justify-between self-start gap-4 md:gap-16 xl:w-4/5 py-16 px-16 lg:px-64">
        <div>
          <h2 className={`${titleFont.className} text-2xl font-medium mb-2.5`}>
            For Writers
          </h2>
          <ul>
            <li>• Easy-to-use blog creation tools</li>
            <li>• Rich text editing capabilities</li>
            <li>• Image upload and management</li>
            <li>• Category organization</li>
          </ul>
        </div>
        <div>
          <h2 className={`${titleFont.className} text-2xl font-medium mb-2.5`}>
            For Readers
          </h2>
          <ul>
            <li>• Diverse content categories</li>
            <li>• Interactive like system</li>
            <li>• Clean, distraction-free reading</li>
            <li>• Easy content discovery</li>
          </ul>
        </div>
      </div>

      <div className="py-16 px-16 lg:px-64 border-b border-t w-full">
        <h2 className={`${titleFont.className} text-2xl font-medium mb-2.5`}>
          Join Our Community
        </h2>
        <p>
          Whether you&apos;re a writer looking to share your voice or a reader
          seeking inspiration, MetaPress is your home. Join our growing
          community of creators and engage with content that matters to you.
        </p>
      </div>

      <div className="py-16 px-16 lg:px-64 w-full">
        <h2 className={`${titleFont.className} text-xl font-medium mb-3.5`}>
          Have questions or want to learn more about MetaPress?
        </h2>
        <Link href="/contact">
          <Button>Contact Us</Button>
        </Link>
      </div>
    </div>
  );
}
