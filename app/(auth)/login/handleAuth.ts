"use server";

import { cookies } from "next/headers";
import { query } from "../../actions/db";
import { redirect } from "next/navigation";

export async function handleAuth(prevState, formData: FormData) {
  const isLogin = formData.get("login") === "1";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = formData.get("email") as string;

  try {
    if (isLogin) {
      const result = await query("SELECT * FROM users WHERE username = $1;", [
        username,
      ]);

      if (result.length > 0 && result[0].password === password) {
        (await cookies()).set("metapress", result[0].userid, {
          httpOnly: true,
          path: "/",
          maxAge: 3600,
        });
        redirect("/");
      }

      return "Invalid username or password.";
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

      const userData = await query(
        "INSERT INTO users(username, name, password, email) VALUES($1, $1, $2, $3) RETURNING userid;",
        [username, password, email]
      );

      (await cookies()).set("metapress", userData[0].userid, {
        httpOnly: true,
        path: "/",
        maxAge: 3600,
      });

      redirect("/");
    }
  } catch (e) {
    console.log(e);
    return "Authentication failed";
  }
}
