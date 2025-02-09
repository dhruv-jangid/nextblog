import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account!.provider === "credentials") {
        return true;
      }
      if (!user.email) return false;

      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            slug: generateSlug(user.name!),
            accounts: {
              create: {
                type: account!.type,
                provider: account!.provider,
                providerAccountId: account!.providerAccountId,
              },
            },
          },
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.slug = token.slug as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.slug = user.slug;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.image = session.user.image;
      }

      return token;
    },
  },
});

const generateSlug = (name: string): string => {
  let slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9_. ]/g, "")
    .replace(/ /g, "_")
    .replace(/^[^a-z]+/g, "")
    .replace(/([_\.])\1+/g, "$1")
    .slice(0, 20);

  if (slug.length === 0) {
    slug = "user";
  }

  const needsPostfix = slug.length < 3 || !/^[a-z]/.test(slug);
  if (needsPostfix) {
    const random = Math.floor(100 + Math.random() * 900).toString();
    slug = (
      slug.replace(/[^a-z0-9_.]/g, "") +
      (slug.length ? "_" : "") +
      random
    )
      .replace(/^[^a-z]+/g, "")
      .slice(0, 20);
  }

  return slug.padEnd(3, "0").replace(/0+$/, "").slice(0, 20);
};
