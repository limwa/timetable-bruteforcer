import { Course } from "../types.d.ts";
import { schema } from "./schema.ts";

export default function parse(data: string): Course[] {
    const res = schema.parse(JSON.parse(data));

    return res.resultados.map(t => ({
        id: t.ocorr_id,
        code: t.codigo,
        year: t.ano_lectivo,
        name: t.nome,
    }));
}