import { createAuthClient } from "better-auth/client";

const AUTH_BASE_URL =
  import.meta.env.PUBLIC_AUTH_BASE_URL ||
  "https://ep-steep-art-aol3cqdt.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
