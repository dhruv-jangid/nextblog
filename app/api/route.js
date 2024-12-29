import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user = await query("SELECT * FROM users WHERE id = $1", [id]);
  return NextResponse.json(user);
}

export async function GET(request) {
  const blogs = await query("SELECT * FROM blogs");
  return NextResponse.json(blogs);
}
