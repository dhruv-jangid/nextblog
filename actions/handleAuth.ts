"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import argon2 from "argon2";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { deleteImages, uploadCover } from "@/lib/handleImage";

const authSchema = z.object({
  login: z.string().transform((val) => val === "true"),
  username: z

    .string()
    .min(3, "Username must have at least 3 characters")
    .regex(
      /^[a-zA-Z][\w-_]*$/,
      "Username must start with a letter and only contain letters, numbers, - and _"
    )
    .optional(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/,
      "Password must have at least 1 uppercase, 1 lowercase and 1 special character"
    ),
  authorImg: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Profile image is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size should be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Invalid file type, only images allowed"
    )
    .optional(),
});

export const handleAuth = async (prevState, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = authSchema.safeParse(data);
  if (!parsedData.success) {
    return parsedData.error.errors.map((err) => err.message).join("<br>");
  }

  const { login, username, password, email, authorImg } = parsedData.data;

  if (login) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user && (await argon2.verify(user.password, password))) {
      (await cookies()).set(
        "metapress",
        JSON.stringify({
          id: user.id,
          slug: user.slug,
        }),
        {
          httpOnly: true,
          path: "/",
          maxAge: 3600,
          sameSite: "strict",
        }
      );

      permanentRedirect("/");
    } else {
      return "Invalid email or password";
    }
  } else {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { slug: username }],
      },
    });
    if (existingUser) {
      return "Email or username already taken";
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await prisma.user.create({
      data: {
        slug: username!,
        name: username!,
        password: hashedPassword,
        email,
      },
    });

    if (authorImg) {
      try {
        await uploadCover(authorImg, `${newUser.id}`, true);
      } catch (error) {
        console.log(error);

        return "Error uploading image";
      }
    } else {
      return "Profile image is required";
    }

    (await cookies()).set(
      "metapress",
      JSON.stringify({
        id: newUser.id,
        slug: newUser.slug,
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 3600,
        sameSite: "strict",
      }
    );

    permanentRedirect("/");
  }
};

export const logoutUser = async () => {
  (await cookies()).delete("metapress");
  permanentRedirect("/login");
};

export const deleteUser = async () => {
  const id = JSON.parse((await cookies()).get("metapress")?.value).id;

  if (!id) {
    return "User not found";
  }

  const blogs = await prisma.blog.findMany({
    where: { authorId: id },
  });

  if (blogs.length > 0) {
    const publicIds = blogs.map((blog) => `nextblog/blogs/${blog.id}`);
    publicIds.push(`nextblog/authors/${id}`);
    await deleteImages(publicIds);
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    logoutUser();
    return "User deleted successfully";
  } catch (error) {
    console.log(error);
    return "User not found or could not be deleted";
  }
};
