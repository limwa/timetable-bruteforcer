import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

export const schema = z.object({
    horario: z.array(
        z.object({
            dia: z.number().gte(1).lte(7),
            hora_inicio: z.number().gte(0).lte(24 * 3600), // 24 hours
            ucurr_sigla: z.string(),
            tipo: z.enum(["T", "TP", "PL"]),
            aula_duracao: z.number().gt(0),
            doc_sigla: z.string(),
            docentes: z.array(
                z.object({
                    doc_codigo: z.string(),
                    doc_nome: z.string(),
                })
            ),
            turmas: z.array(
                z.object({
                    turma_id: z.number(),
                    turma_sigla: z.string(),
                })
            )
        })
    )
});

export type ScheduleApiResponse = z.infer<typeof schema>;