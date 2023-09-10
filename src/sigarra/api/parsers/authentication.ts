import { z } from "@/deps.ts";

const schema = z
  .object({
    authenticated: z.literal(true),
  })
  .or(
    z.object({
      authenticated: z.literal(false),
      erro_msg: z.string(),
    })
  );
  
type AuthenticationResult =
  | { authenticated: true }
  | { authenticated: false; error: string };

export default function parse(data: unknown): AuthenticationResult {
  const res = schema.parse(data);

  return res.authenticated
    ? { authenticated: true }
    : { authenticated: false, error: res.erro_msg };
}
