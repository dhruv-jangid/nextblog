"use server";

import { cookies } from "next/headers";
import { insertBlog, query } from "@/actions/db";
import { redirect } from "next/navigation";

export async function postBlog(prevState, formData) {
  const user_id = Number((await cookies()).get("metapress")?.value);
  const { title, blogCover, content, category } = formData;
  const date = Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());

  const blogId = await insertBlog(
    title,
    content,
    date,
    user_id,
    category,
    blogCover
  );

  const username = await query("SELECT username FROM users WHERE userid = $1", [
    user_id,
  ]);

  redirect(`/blogs/${username[0].username}/${blogId[0].blogid}#userblog`);
}
