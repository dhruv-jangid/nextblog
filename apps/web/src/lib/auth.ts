import "server-only";
import {
  resetPasswordText,
  verificationEmailText,
  changeEmailVerificationText,
  deleteAccountVerificationText,
} from "@/core/mail/mail.constants";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { MailService } from "@/core/mail/mail.service";
import { usernameBFCK } from "@/core/cache/cache.keys";
import { CacheService } from "@/core/cache/cache.service";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
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
  advanced: {
    cookiePrefix: "metapress",
    database: { generateId: false },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        user: { name, email },
        url,
        newEmail,
      }) => {
        await MailService.send({
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

        await MailService.send({
          to: email,
          subject: "Delete your MetaPress account",
          text: deleteAccountVerificationText({ name, url }),
        });
      },
    },
    additionalFields: {
      username: { type: "string" },
      role: { type: "string" },
      banned: { type: "boolean" },
    },
  },
  hooks: {
    after: createAuthMiddleware(async ({ path, body }) => {
      if (path.startsWith("/sign-up")) {
        try {
          if (body.username) {
            await CacheService.sAdd(usernameBFCK, body.username.toLowerCase());
          }
        } catch (error) {
          console.error("Failed to add username to cache:", error);
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user: { name, email }, url }) => {
      await MailService.send({
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
      await MailService.send({
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
      mapProfileToUser: async ({ id }) => {
        return {
          username: id + "_gb",
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: async ({ sub }) => {
        return {
          username: sub + "_gl",
        };
      },
    },
  },
  secondaryStorage: {
    get: async (key) => {
      return await CacheService.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl && ttl > 0) {
        await CacheService.set(key, value, ttl);
      } else {
        await CacheService.set(key, value);
      }
    },
    delete: async (key) => {
      await CacheService.del(key);
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
  onAPIError: { throw: true },
  telemetry: { enabled: false },
} satisfies BetterAuthOptions);
