import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "https://ep-steep-art-aol3cqdt.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth",
});

export const { signIn, signUp, signOut, useSession } = authClient;
