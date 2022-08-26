import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

export const schema = z.object({
    resultados: z.array(
        z.object({
            codigo: z.string(),
            nome: z.string(),
            sigla: z.string(),
        })
    ),
});

export type TeacherSearchApiResponse = z.infer<typeof schema>;