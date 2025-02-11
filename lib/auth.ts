import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize({ email, password }) {
        if (!email || !password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              slug: true,
              image: true,
              role: true,
              password: true,
              accounts: true,
            },
          });
          if (!user?.password) return null;

          const isValid = await argon2.verify(
            user.password,
            password as string
          );
          if (!isValid) return null;

          const { password: _, accounts: __, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account!.provider === "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            accounts: true,
          },
        });

        if (existingUser) {
          const existingAccount = existingUser.accounts.find(
            (acc) => acc.provider === "credentials"
          );

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: "credentials",
                provider: "credentials",
                providerAccountId: existingUser.id,
              },
            });
          }
          return true;
        }
      }
      if (account!.provider === "credentials") {
        return true;
      }
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          accounts: true,
        },
      });

      if (existingUser) {
        const existingAccount = existingUser.accounts.find(
          (acc) => acc.provider === account!.provider
        );

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account!.type,
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
            },
          });
        }
        return true;
      }

      await prisma.user.create({
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
