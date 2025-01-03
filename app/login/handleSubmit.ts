"use server";

import { query } from "../actions/db";

interface formDataProps {
  username: string;
  password: string;
  email: string;
  login: boolean;
}

export const handleSubmit = async (formData: formDataProps) => {
  const { username, password, email, login } = formData;

  if (login) {
    const result = await query(
      "SELECT name, password FROM users WHERE name = $1;",
      [username]
    );

    if (result.length > 0 && result[0].password === password) {
      return { success: true, message: "Login successful!" };
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

    await query(
      "INSERT INTO users(name, pet_name, password, email) VALUES($1, $1, $2, $3);",
      [username, password, email]
    );

    return { success: true, message: "Registration successful!" };
  }
};
