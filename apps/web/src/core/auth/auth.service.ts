import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export class AuthService {
  static getUserSession = async () => {
    const session = await auth.api.getSession({ headers: await headers() });

    return session?.user ?? null;
  };
}
