import { Teacher } from "../types.d.ts";
import { schema } from "./schema.ts";

export default function parse(data: string): Teacher[] {
    const res = schema.parse(JSON.parse(data));

    return res.resultados.map(t => ({
        id: t.codigo,
        name: t.nome,
        abbreviation: t.sigla,
    }));
}