import { z } from "@/deps.ts";
import { Course } from "@/models/course.ts";
import { courseRegistry } from "@/sigarra/registries.ts";

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

export default function parse(data: unknown): Course[] {
  const res = schema.parse(data);

  return res.resultados.map((t) =>
    courseRegistry.set(
      new Course({
        id: t.ocorr_id,
        code: t.codigo,
        year: t.ano_lectivo,
        name: t.nome,
      })
    )
  );
}
