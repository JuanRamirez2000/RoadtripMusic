import { signIn } from "auth";

export default async function AuthSignIn() {
  await signIn();
  return null;
}
