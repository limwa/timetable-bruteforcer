import { z } from "@/deps.ts";
import { teacherRegistry } from "@/sigarra/registries.ts";
import { Teacher } from "@/models/teacher.ts";

const schema = z.object({
  resultados: z.array(
    z.object({
      codigo: z.string(),
      nome: z.string(),
      sigla: z.string(),
    })
  ),
});

export default function parse(data: unknown): Teacher[] {
  const res = schema.parse(data);

  return res.resultados.map((t) =>
    teacherRegistry.set(
      new Teacher({
        id: t.codigo,
        name: t.nome,
        abbreviation: t.sigla,
      })
    )
  );
}
