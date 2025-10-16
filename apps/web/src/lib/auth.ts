import "server-only";
import {
  resetPasswordText,
  verificationEmailText,
  changeEmailVerificationText,
  deleteAccountVerificationText,
} from "@/lib/email/texts";
import { db } from "@/db/index";
import { redis } from "@/lib/redis";
import * as schema from "@/db/schema";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/email/send-email";
import { admin, username } from "better-auth/plugins";
import { generateUsername } from "@/actions/handle-user";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth, type BetterAuthOptions } from "better-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  plugins: [
    nextCookies(),
    username(),
    admin({
      bannedUserMessage: "You have been banned from MetaPress",
      defaultBanExpiresIn: 60 * 60 * 24 * 7,
    }),
  ],
  appName: "MetaPress",
  account: { encryptOAuthTokens: true },
  advanced: { cookiePrefix: "metapress", database: { generateId: false } },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user: { name, email },
        url,
        newEmail,
      }) => {
        await sendEmail({
          subject: "Confirm your new email address",
          to: email,
          text: changeEmailVerificationText({ name, newEmail, url }),
        });
      },
    },
    deleteUser: {
      enabled: true,
      deleteTokenExpiresIn: 60 * 60,
      sendDeleteAccountVerification: async ({
        user: { name, email, createdAt },
        url,
      }) => {
        const diffInHours =
          (new Date().getTime() - new Date(createdAt).getTime()) /
          (1000 * 60 * 60);
        if (diffInHours < 24) {
          throw new APIError("TOO_EARLY", { message: "Try again later" });
        }

        await sendEmail({
          to: email,
          subject: "Delete your MetaPress account",
          text: deleteAccountVerificationText({ name, url }),
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user: { name, email }, url }) => {
      await sendEmail({
        to: email,
        subject: "Reset your MetaPress password",
        text: resetPasswordText({ name, url }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user: { name, email }, url }) => {
      await sendEmail({
        to: email,
        subject: "Verify your MetaPress email",
        text: verificationEmailText({ name, url }),
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      mapProfileToUser: async ({ login: name }) => {
        return {
          username: await generateUsername({ name }),
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: async ({ name }) => {
        return {
          username: await generateUsername({ name }),
        };
      },
    },
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(key);
      return value;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        const ttlSeconds = Math.floor(Number(ttl));
        if (ttlSeconds > 0) {
          await redis.set(key, value, { EX: ttlSeconds });
        } else {
          await redis.set(key, value);
        }
      } else {
        await redis.set(key, value);
      }
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  rateLimit: {
    customRules: {
      "/sign-up/email": { window: 10, max: 3 },
      "/sign-in/email": { window: 10, max: 3 },
      "/forget-password": { window: 3600, max: 1 },
      "/reset-password": { window: 3600, max: 1 },
      "/reset-password/*": { window: 3600, max: 1 },
      "/update-user": { window: 3600, max: 3 },
    },
  },
  session: { cookieCache: { enabled: true } },
  onAPIError: { errorURL: "/error" },
  telemetry: { enabled: false },
} satisfies BetterAuthOptions);
