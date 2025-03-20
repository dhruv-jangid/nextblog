import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/sendEmail";
import argon2 from "argon2";
import { generateSlug } from "@/utils/generateSlug";
import z from "zod";
import { nextCookies } from "better-auth/next-js";
import { removeImages } from "@/actions/handleUser";
import { APIError } from "better-auth/api";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
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
          input: z
            .string({ required_error: "Username is required!" })
            .min(3, "Username must have at least 3 characters")
            .max(20, "Username must be less than 20 characters")
            .regex(
              /^[a-z][a-z0-9_.]*$/,
              "Must start with lowercase letter and contain only a-z, 0-9, . and _"
            ),
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
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email ${url}`,
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
          slug: generateSlug(profile.name),
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          role: "USER",
          slug: generateSlug(profile.name),
        };
      },
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
