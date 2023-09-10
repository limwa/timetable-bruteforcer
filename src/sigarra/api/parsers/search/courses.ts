import { z } from "@/deps.ts";

const schema = z.object({
    resultados: z.array(
        z.object({
            ocorr_id: z.number(),
            codigo: z.string(),
            nome: z.string(),
            ano_lectivo: z.number(),
        })
    ),
});

type Course = {
    id: number,
    code: string,
    year: number,
    name: string,
};

export default function parse(data: unknown): Course[] {
    const res = schema.parse(data);

    return res.resultados.map(t => ({
        id: t.ocorr_id,
        code: t.codigo,
        year: t.ano_lectivo,
        name: t.nome,
    }));
}