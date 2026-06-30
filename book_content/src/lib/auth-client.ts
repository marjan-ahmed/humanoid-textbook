import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
export default authClient;
