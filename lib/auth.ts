import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/sendEmail";
import argon2 from "argon2";
import { nextCookies } from "better-auth/next-js";
import { removeImages } from "@/actions/handleUser";
import { APIError } from "better-auth/api";
import { generateSlug } from "@/utils/generateSlug";
import { slugValidator } from "@/utils/zod";

export const auth = betterAuth({
  database: prismaAdapter(new PrismaClient(), {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  appName: "Metapress",
  advanced: { cookiePrefix: "metapress" },
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        const createdAt = new Date(user.createdAt);
        const now = new Date();
        const diffInHours =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
          throw new APIError("BAD_REQUEST", {
            message: "Account must be at least 24 hours old before deletion",
          });
        }
        await sendEmail({
          to: user.email,
          subject: "Account Deletion",
          text: `Click the link to delete your MetaPress account ${url}`,
        });
      },
      beforeDelete: async ({ id, email, createdAt }) => {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const timeSinceCreation = Date.now() - createdAt.getTime();

        if (timeSinceCreation < twentyFourHours) {
          throw new APIError("BAD_REQUEST", {
            message: "Account must be at least 24 hours old before deletion",
          });
        }
        if (email.includes("ADMIN")) {
          throw new APIError("BAD_REQUEST", {
            message: "Admin accounts can't be deleted",
          });
        }
        await removeImages(id);
      },
    },
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
      slug: {
        type: "string",
        required: true,
        unique: true,
        validator: {
          input: slugValidator,
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    password: {
      hash: async (password) => {
        return await argon2.hash(password);
      },
      verify: async ({ hash, password }) => {
        return await argon2.verify(hash, password);
      },
    },
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          role: "USER",
          slug: generateSlug(profile.login, profile.id),
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          role: "USER",
          slug: generateSlug(profile.name, profile.sub),
        };
      },
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
