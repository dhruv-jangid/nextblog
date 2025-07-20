"use server";

import "server-only";
import {
  nameValidator,
  getFirstZodError,
  contactValidator,
  usernameValidator,
} from "@/lib/schemas/shared";
import { db } from "@/db";
import { ZodError } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { users } from "@/db/schema";
import { headers } from "next/headers";
import { customAlphabet } from "nanoid";
import { APIError } from "better-auth/api";
import { sendEmail } from "@/lib/email/sendEmail";
import { imageValidator } from "@/lib/schemas/server";
import { contactMessage } from "@/lib/email/emailTexts";
import { deleteImage } from "@/actions/handleCloudinary";
import { getPublicIdFromImageUrl } from "@/lib/imageUtils";
import { slugifyUsername, restrictedUsernames } from "@/lib/utils";

export const changeName = async ({
  newName,
}: {
  newName: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const name = nameValidator.parse(newName);

    await auth.api.updateUser({ body: { name }, headers: await headers() });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const changeUsername = async ({
  newUsername,
}: {
  newUsername: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const username = usernameValidator.parse(newUsername);

    await auth.api.updateUser({ body: { username }, headers: await headers() });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const changeProfileImage = async ({
  newImage,
}: {
  newImage: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { image: prevImage } = session.user;
  try {
    const image = imageValidator.parse(newImage);

    if (prevImage && prevImage.includes("cloudinary")) {
      const publicId = getPublicIdFromImageUrl({
        url: prevImage,
        isUser: true,
      });
      await deleteImage({ publicId });
    }

    await auth.api.updateUser({ body: { image }, headers: await headers() });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const removeProfileImage = async (): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { image } = session.user;
  if (!image) {
    throw new Error("No image");
  }
  try {
    if (image.includes("cloudinary")) {
      const publicId = getPublicIdFromImageUrl({ url: image, isUser: true });
      await deleteImage({ publicId });
    }

    await auth.api.updateUser({
      body: { image: null as any },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteUser = async (body: { password: string }): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { image } = session.user;
  try {
    if (image && image.includes("cloudinary")) {
      await deleteImage({
        publicId: getPublicIdFromImageUrl({ url: image, isUser: true }),
      });
    }

    await auth.api.deleteUser({ body, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

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
    const { subject, message } = contactValidator.parse(data);

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
