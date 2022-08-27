import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

export const schema = z.object({
    resultados: z.array(
        z.object({
            ocorr_id: z.number(),
            codigo: z.string(),
            nome: z.string(),
            ano_lectivo: z.number(),
        })
    ),
});

export type TeacherSearchApiResponse = z.infer<typeof schema>;