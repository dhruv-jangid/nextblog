import "server-only";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { blogs } from "@/db/schema";
import { slugifyTitle } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")!;

  const slug = slugifyTitle({ title });
  try {
    const [exists] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);

    return Response.json({ exists: !!exists });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}
