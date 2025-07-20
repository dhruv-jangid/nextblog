import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")!;

  const { available } = await auth.api.isUsernameAvailable({
    body: { username },
  });

  return Response.json({ available: !!available });
}
