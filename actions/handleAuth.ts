"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import argon2 from "argon2";
import { prisma } from "@/lib/db";

export async function handleAuth(prevState, formData: FormData) {
  const isLogin = formData.get("login") === "1";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;

  if (isLogin) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const isPasswordValid = await argon2.verify(user.password, password);

      if (isPasswordValid) {
        (await cookies()).set("metapress", user.id, {
          httpOnly: true,
          path: "/",
          maxAge: 3600,
        });

        permanentRedirect("/");
      } else {
        return "Invalid email or password.";
      }
    } else {
      return "Invalid email or password.";
    }
  } else {
    const usernameExists = await prisma.user.findUnique({
      where: { slug: username },
    });

    if (usernameExists) {
      return "Username already taken!";
    }

    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return "Email already registered!";
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        slug: username,
        name: username,
        password: hashedPassword,
        email,
      },
    });

    (await cookies()).set("metapress", newUser.id, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      sameSite: "strict",
    });

    permanentRedirect("/");
  }
}

export const logoutUser = async () => {
  (await cookies()).delete("metapress");

  permanentRedirect("/login");
};
