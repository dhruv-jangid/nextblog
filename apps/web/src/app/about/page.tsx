import "server-only";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HorizontalList } from "@/components/h-list";

export const metadata: Metadata = {
  title: "MetaPress | About",
  description: "About MetaPress",
};

export default function About() {
  return (
    <section className=" space-y-4 m-4 lg:m-8">
      <div className="flex flex-col gap-16 py-6 xl:py-12 bg-accent rounded-xl border">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-0 p-6 md:p-12">
          <div className="space-y-2 font-medium">
            <span className="text-sm tracking-tight text-orange-500">
              OUR STEPS
            </span>
            <div className="text-5xl xl:text-6xl tracking-tighter">
              Our creative workflow
              <br />
              it&apos;s not just a vision.
            </div>
          </div>
          <div className="space-y-4 md:space-y-8">
            <div className="w-3xs xl:w-xs text-balance tracking-tight text-orange-500">
              "We find our work fulfilling when insight, timing, and
              authenticity come together"
            </div>
            <span className="text-sm font-semibold">DHRUV JANGID</span>
          </div>
        </div>
        <HorizontalList
          data={[
            {
              image: "/images/creative-writing.jpg",
              tag: "STORYTELLING FIRST",
              title: "Writing & Creativity",
              content:
                "Every great blog begins with an idea. We focus on crafting authentic stories, thoughtful insights, and creative perspectives that connect with readers. From brainstorming to publishing — every word matters here.",
            },
            {
              image: "/images/content-strategy.jpg",
              tag: "STRATEGY MATTERS",
              title: "Content Planning",
              content:
                "Behind every post is a plan. We create content that’s not only engaging but also meaningful — blending SEO strategy, readability, and originality to reach the right audience at the right time.",
            },
            {
              image: "/images/testing-feedback.jpg",
              tag: "RESEARCH & FEEDBACK",
              title: "Testing & Refining",
              content:
                "Before hitting publish, every piece goes through feedback loops and fine-tuning. We listen to our readers, analyze what works, and continuously evolve to keep our content valuable and relevant.",
            },
            {
              image: "/images/community.jpg",
              tag: "READERS FIRST",
              title: "Community",
              content:
                "A blog is more than posts — it’s people. We aim to build a community of readers and writers who share ideas, stories, and support. Your comments and voices are what keep this space alive.",
            },
            {
              image: "/images/growth-analytics.jpg",
              tag: "CONTINUOUS GROWTH",
              title: "Learning & Evolving",
              content:
                "The digital world changes fast, and so do we. We experiment, learn from analytics, and adapt to trends without losing our voice. Growth isn’t just numbers — it’s improvement in every post we share.",
            },
          ]}
        />
      </div>
      <div className="flex flex-col lg:flex-row overflow-hidden px-4 lg:px-8 -mt-4">
        <div className="relative aspect-square w-full lg:w-1/2 border border-t-0 rounded-xl rounded-t-none overflow-hidden">
          <Image
            src="/images/creativity-process.jpg"
            alt="Creativity Process Image"
            fill
            priority={false}
            placeholder="empty"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover sepia-50"
          />
        </div>
        <div className="flex flex-col justify-center p-4 2xl:p-0 2xl:pl-16 gap-2 lg:gap-4 w-full lg:w-1/2">
          <div className="text-sm">KNOW HOW</div>
          <div className="text-6xl xl:text-7xl leading-14 xl:leading-16 tracking-tighter">
            <div>Creativity</div>
            <div>and Innovation</div>
            <div>built-in.</div>
          </div>
          <div className="leading-snug max-w-sm my-2">
            From the first spark of an idea to the final published piece,
            creativity drives everything we do. Each blog post is crafted
            through exploration, design, and a touch of innovation — blending
            storytelling with modern digital tools. We believe in experimenting,
            learning, and evolving with every article we write.
          </div>
          <Link href="/contact">
            <Button size="lg">
              Contact Us <CornerDownRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-16 py-6 xl:py-12 bg-accent rounded-xl rounded-b-none -mb-8 border border-b-0">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-0 p-6 md:p-12">
          <div className="space-y-2 font-medium">
            <span className="text-sm tracking-tight text-orange-500">
              OUR COMMUNITY
            </span>
            <div className="text-5xl xl:text-6xl tracking-tighter">
              Not just a team,
              <br />
              but a big family.
            </div>
          </div>
          <div className="space-y-4 md:space-y-8">
            <div className="w-3xs xl:w-xs text-balance tracking-tight text-orange-500">
              "The real magic happens when insight meets timing — and everything
              feels true to who we are"
            </div>
            <span className="text-sm font-semibold">DHRUV JANGID</span>
          </div>
        </div>
        <HorizontalList
          data={[
            {
              image: "/images/me.png",
              title: "Me",
            },
            {
              image: "/images/mark-zuckerberg.jpg",
              title: "Zuckerberg",
            },
            {
              image: "/images/tim-cook.jpg",
              title: "Tim Cook",
            },
            {
              image: "/images/elon-musk.jpg",
              title: "Elon Musk",
            },
            {
              image: "/images/jeff-bezos.jpg",
              title: "Jeff Bezos",
            },
            {
              image: "/images/sundar-pichai.jpg",
              title: "Sundar Pichai",
            },
            {
              image: "/images/satya-nadella.jpg",
              title: "Satya Nadella",
            },
          ]}
          imageOnly
        />
        <div className="flex flex-col lg:flex-row items-end gap-4 w-full overflow-hidden">
          <div className="relative w-full h-96 xl:h-132 2xl:h-172 xl:w-7/12">
            <Image
              src="/images/left.jpg"
              alt="Pencil"
              fill
              placeholder="empty"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-xl rounded-l-none border border-l-0 sepia-50 brightness-90"
            />
          </div>
          <div className="relative w-2/3 h-64 xl:h-96 2xl:h-124 xl:w-5/12">
            <Image
              src="/images/right.jpg"
              alt="Pencils"
              fill
              placeholder="empty"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-xl rounded-r-none border border-r-0 sepia-50 brightness-90 contrast-125"
            />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-16 xl:gap-0 p-4 xl:px-12 xl:py-36">
          <div className="space-y-36 xl:space-y-24">
            <div className="relative">
              <span className="text-8xl xl:text-[12rem] font-light leading-0">
                &ldquo;
              </span>
              <span className="absolute -top-10 xl:-top-16 left-9 xl:left-15 xl:w-3xl text-2xl xl:text-4xl font-medium tracking-tighter">
                We&apos;re always exploring new ideas
              </span>
              <span className="absolute -top-2 xl:-top-5.5 left-0 w-xs xl:w-2xl text-2xl xl:text-4xl font-medium tracking-tighter">
                and creative approaches — pushing boundaries to make every story
                smarter, fresher, and more meaningful.
              </span>
            </div>
            <div className="inline-flex">
              <div className="relative aspect-[3/4] w-24">
                <Image
                  src="/images/me.png"
                  alt="Me"
                  fill
                  priority={false}
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl border sepia-50"
                />
              </div>
              <div className="pl-4 space-y-2">
                <div className="text-orange-500 text-sm tracking-tight">
                  MetaPress
                </div>
                <div>
                  <div className="text-2xl font-medium tracking-tighter">
                    Dhruv Jangid
                  </div>
                  <div className="tracking-tight">CEO & Founder</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 xl:gap-24 xl:-mt-18 xl:pr-16">
            <div className="space-y-4 xl:space-y-8 border-b pb-12 xl:pb-24">
              <div className="flex gap-4 xl:gap-8">
                <span className="text-3xl xl:text-4xl leading-7 tracking-tight font-semibold">
                  23K
                </span>
                <div className="flex flex-col leading-4">
                  <span>Daily</span>
                  <span>Readers</span>
                </div>
              </div>
              <div className="text-sm max-w-3xs text-balance">
                Our growing community of readers who engage with fresh stories
                and insights every day.
              </div>
            </div>
            <div className="space-y-4 xl:space-y-8 border-b pb-12 xl:pb-24">
              <div className="flex gap-4 xl:gap-8">
                <span className="text-3xl xl:text-4xl leading-7 tracking-tight font-semibold">
                  38K
                </span>
                <div className="flex flex-col leading-4">
                  <span>Words</span>
                  <span>Published</span>
                </div>
              </div>
              <div className="text-sm max-w-3xs text-balance">
                From deep dives to creative essays — a reflection of our passion
                for storytelling and sharing ideas.
              </div>
            </div>
            <div className="space-y-4 xl:space-y-8 border-b pb-12 xl:pb-24">
              <div className="flex gap-4 xl:gap-8">
                <span className="text-3xl xl:text-4xl leading-7 tracking-tight font-semibold">
                  85%
                </span>
                <div className="flex flex-col leading-4">
                  <span>Original</span>
                  <span>Content</span>
                </div>
              </div>
              <div className="text-sm max-w-3xs text-balance">
                Most of our posts are built from authentic experiences,
                thoughts, and perspectives — no AI fluff, just real voices.
              </div>
            </div>
            <div className="space-y-4 xl:space-y-8 border-b pb-12 xl:pb-24">
              <div className="flex gap-4 xl:gap-8">
                <span className="text-3xl xl:text-4xl leading-7 tracking-tight font-semibold">
                  168
                </span>
                <div className="flex flex-col leading-4">
                  <span>Collaborators</span>
                  <span>& Writers</span>
                </div>
              </div>
              <div className="text-sm max-w-3xs text-balance">
                A vibrant network of contributors, editors, and creatives
                shaping our platform together.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
