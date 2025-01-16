"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { query } from "@/actions/db";
import argon2 from "argon2";
import { revalidatePath } from "next/cache";

export async function handleAuth(prevState, formData: FormData) {
  const isLogin = formData.get("login") === "1";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;

  if (isLogin) {
    const result = await query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (result.length > 0) {
      const isPasswordValid = await argon2.verify(result[0].password, password);

      if (isPasswordValid) {
        (await cookies()).set("metapress", result[0].userid, {
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
    const usernameCheck = await query(
      "SELECT username FROM users WHERE username = $1;",
      [username]
    );

    if (usernameCheck.length > 0) {
      return "Username already taken!";
    }

    const emailCheck = await query(
      "SELECT email FROM users WHERE email = $1;",
      [email]
    );

    if (emailCheck.length > 0) {
      return "Email already registered!";
    }

    const hashedPassword = await argon2.hash(password);
    const userData = await query(
      "INSERT INTO users(username, name, password, email) VALUES($1, $1, $2, $3) RETURNING userid;",
      [username, hashedPassword, email]
    );

    (await cookies()).set("metapress", userData[0].userid, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      sameSite: true,
    });

    permanentRedirect("/");
  }
}

export const logoutUser = async () => {
  (await cookies()).delete("metapress");

  revalidatePath("/login");
  permanentRedirect("/login");
};
