"use server";

import { cookies } from "next/headers";
import { query } from "../../actions/db";

interface formDataProps {
  username: string;
  password: string;
  email: string;
  login: boolean;
}

export const handleSubmit = async (formData: formDataProps) => {
  const { username, password, email, login } = formData;

  if (login) {
    const result = await query("SELECT * FROM users WHERE name = $1;", [
      username,
    ]);

    if (result.length > 0 && result[0].password === password) {
      return { success: true, userData: result[0] };
    }

    return { success: false, message: "Invalid username or password." };
  } else {
    const usernameCheck = await query(
      "SELECT name FROM users WHERE name = $1;",
      [username]
    );

    if (usernameCheck.length > 0) {
      return { success: false, message: "Username already taken!" };
    }

    const emailCheck = await query(
      "SELECT email FROM users WHERE email = $1;",
      [email]
    );

    if (emailCheck.length > 0) {
      return { success: false, message: "Email already registered!" };
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

    return { success: true, photo: true, message: "Registration successful!" };
  }
};
