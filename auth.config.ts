import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/db";
import argon2 from "argon2";

export default {
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize({ email, password }) {
        if (!email || !password) {
          return null;
        }

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

          if (!user.accounts.find((acc) => acc.provider === "credentials")) {
            await prisma.account.create({
              data: {
                userId: user.id,
                type: "credentials",
                provider: "credentials",
                providerAccountId: user.id,
              },
            });
          }

          const { password: _, accounts: __, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
