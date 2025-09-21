"use server";

import "server-only";
import { db } from "@/db";
import { ZodError } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { users } from "@/db/schema";
import { headers } from "next/headers";
import { customAlphabet } from "nanoid";
import { sendEmail } from "@/lib/email/send-email";
import { contactMessage } from "@/lib/email/texts";
import { slugifyUsername, restrictedUsernames } from "@/lib/utils";
import { getFirstZodError, contactSchema } from "@/lib/schemas/other";

export const contactUser = async (data: {
  subject: string;
  message: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { name, email } = session.user;
  try {
    const { subject, message } = contactSchema.parse(data);

    await sendEmail({
      subject,
      to: email,
      text: contactMessage({ name, subject, message }),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const subscribeNewsletter = async (): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Sign in to subscribe to newsletter");
  }

  const { email } = session.user;
  try {
    await sendEmail({
      subject: "Newsletter Subscription",
      to: email,
      text: `Thanks for subscribing to our newsletter!`,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

const MAX_USERNAME_LENGTH = 32;
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);
const longNanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);
export const generateUsername = async ({
  name,
}: {
  name: string;
}): Promise<string> => {
  const rawBase = slugifyUsername({ name }) || "user";
  const isReserved = restrictedUsernames.has(rawBase);

  let username = rawBase;

  if (!isReserved) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existing.length === 0) {
      return username.slice(0, MAX_USERNAME_LENGTH);
    }
  }

  let attempts = 0;
  let exists: (typeof users.$inferSelect)[] = [];

  do {
    const suffix = `_${nanoid()}`;
    const base = rawBase.slice(0, MAX_USERNAME_LENGTH - suffix.length);
    username = `${base}${suffix}`;

    exists = await db.select().from(users).where(eq(users.username, username));
    attempts++;
  } while (exists.length > 0 && attempts < 3);

  if (exists.length > 0) {
    const suffix = `_${longNanoid()}`;
    const base = rawBase.slice(0, MAX_USERNAME_LENGTH - suffix.length);
    username = `${base}${suffix}`;
  }

  return username;
};
