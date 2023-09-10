import { dotenv, z } from "@/deps.ts";

const schema = z.object({
    SI_USERNAME: z.string().regex(/^up[0-9]{9}$/),
    SI_PASSWORD: z.string(),
});

export async function load() {
    await dotenv.load({
        examplePath: null,
        defaultsPath: null,
        export: true
    });

    return schema.parse(Deno.env.toObject());
}