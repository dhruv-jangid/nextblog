import Link from "next/link";
import { Button } from "@/components/button";

export default function About() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center p-4 lg:p-12 antialiased text-balance">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">About MetaPress</h1>
          <p className="text-gray-400 text-xl tracking-tight">
            The Pulse of Creativity - Where Ideas Come to Life
          </p>
        </div>

        <div className="bg-[#191919] p-6 lg:p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed tracking-tight">
            MetaPress is a platform dedicated to empowering writers, thinkers,
            and creators to share their stories with the world. We believe in
            the power of words to inspire, educate, and connect people across
            boundaries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#191919] p-6 rounded-2xl space-y-3">
            <h3 className="text-xl font-semibold">For Writers</h3>
            <ul className="text-gray-300 text-lg tracking-tight space-y-1">
              <li>• Easy-to-use blog creation tools</li>
              <li>• Rich text editing capabilities</li>
              <li>• Image upload and management</li>
              <li>• Category organization</li>
            </ul>
          </div>

          <div className="bg-[#191919] p-6 rounded-2xl space-y-3">
            <h3 className="text-xl font-semibold">For Readers</h3>
            <ul className="text-gray-300 text-lg tracking-tight space-y-1">
              <li>• Diverse content categories</li>
              <li>• Interactive like system</li>
              <li>• Clean, distraction-free reading</li>
              <li>• Easy content discovery</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#191919] p-6 lg:p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-semibold">Join Our Community</h2>
          <p className="text-gray-300 leading-relaxed text-lg tracking-tight">
            Whether you&apos;re a writer looking to share your voice or a reader
            seeking inspiration, MetaPress is your home. Join our growing
            community of creators and engage with content that matters to you.
          </p>
        </div>

        <div className="text-center space-y-4 pb-8">
          <p className="text-gray-300 text-lg tracking-tight">
            Have questions or want to learn more about MetaPress?
          </p>
          <Link href="/contact" className="text-lg">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
