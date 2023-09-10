import { z } from "@/deps.ts";

const schema = z.object({
    resultados: z.array(
        z.object({
            codigo: z.string(),
            nome: z.string(),
            sigla: z.string(),
        })
    ),
});

type Teacher = {
    id: string,
    name: string,
    abbreviation: string,
}

export default function parse(data: unknown): Teacher[] {
    const res = schema.parse(data);

    return res.resultados.map(t => ({
        id: t.codigo,
        name: t.nome,
        abbreviation: t.sigla,
    }));
}