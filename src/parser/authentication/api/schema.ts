import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

export const schema = z.object({
    authenticated: z.literal(true)
}).or(
    z.object({
        authenticated: z.literal(false),
        erro_msg: z.string()
    })
)

export type AuthenticationApiResponse = z.infer<typeof schema>;