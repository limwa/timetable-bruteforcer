import { Schedule } from "@/models/schedule.ts";
import { daysOfTheWeek } from "@/utils/days.ts";
import { z } from "@/deps.ts";
import { zUnitType } from "@/utils/zod.ts";
import { Class } from "@/models/class.ts";
import { Unit } from "@/models/unit.ts";
import { courseRegistry, teacherRegistry } from "@/sigarra/registries.ts";

const schema = z.object({
  horario: z.array(
    z.object({
      dia: z.number().gte(1).lte(7),
      hora_inicio: z
        .number()
        .gte(0)
        .lte(24 * 3600), // 24 hours
      ocorrencia_id: z.number(),
      tipo: zUnitType,
      aula_duracao: z.number().gt(0),
      docentes: z.array(
        z.object({
          doc_codigo: z.string(),
        })
      ),
      turmas: z.array(
        z.object({
          turma_id: z.number(),
          turma_sigla: z.string(),
        })
      ),
    })
  ),
});

export default async function parse(data: unknown) {
  const res = schema.parse(data);
  const schedule = new Schedule();

  const units = res.horario;
  for (const unit of units) {
    const start = Math.floor(unit.hora_inicio / 60);
    const end = start + unit.aula_duracao * 60; // 60 = 1 hour in minutes

    const type = unit.tipo;

    const teachers = await Promise.all(
      unit.docentes.map((t) => teacherRegistry.get(t.doc_codigo))
    );

    const classes = unit.turmas.map(
      (t) => new Class({ id: t.turma_id, name: t.turma_sigla })
    );

    const day = daysOfTheWeek[unit.dia - 1]!;
    const course = await courseRegistry.get(unit.ocorrencia_id);

    schedule.addUnit(
      day,
      new Unit({ start, end, course, type, teachers, classes })
    );
  }

  return schedule;
}
