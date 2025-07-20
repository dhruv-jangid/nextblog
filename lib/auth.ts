import "server-only";
import {
  resetPasswordText,
  verificationEmailText,
  changeEmailVerificationText,
  deleteAccountVerificationText,
} from "@/lib/email/emailTexts";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/email/sendEmail";
import { admin, username } from "better-auth/plugins";
import { generateUsername } from "@/actions/handleUser";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

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
          throw new Error("Try again later");
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
  verification: { disableCleanup: true },
  onAPIError: { errorURL: "/signin" },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
