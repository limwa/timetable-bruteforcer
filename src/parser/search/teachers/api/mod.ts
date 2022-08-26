import { Teacher } from "../types.d.ts";
import { schema } from "./schema.ts";

export default function parse(data: string): Teacher | null {
    const res = schema.parse(JSON.parse(data));

    if (res.resultados.length === 0) return null;

    const firstResult = res.resultados[0];

    return {
        id: firstResult.codigo,
        name: firstResult.nome,
        abbreviation: firstResult.sigla,
    };
}