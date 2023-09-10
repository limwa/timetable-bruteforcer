import { Schedule, ScheduleTeacher, ScheduleClass, ScheduleUnitTypes } from "@/models/schedule.ts";
import { daysOfTheWeek } from "@/utils/days.ts";
import { z } from "@/deps.ts";

const schema = z.object({
    horario: z.array(
        z.object({
            dia: z.number().gte(1).lte(7),
            hora_inicio: z.number().gte(0).lte(24 * 3600), // 24 hours
            ucurr_sigla: z.string(),
            ocorrencia_id: z.number(),
            tipo: z.enum(["T", "TP", "PL", "OT"]),
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

export default function parse(data: unknown) {
    const res = schema.parse(data);
    const schedule = new Schedule();

    const units = res.horario;
    for (const unit of units) {
        
        const start = Math.floor(unit.hora_inicio / 60);
        const end = start + unit.aula_duracao * 60; // 60 = 1 hour in minutes
        
        const course = unit.ucurr_sigla;
        const type: ScheduleUnitTypes = unit.tipo;
        const teachersAbbreviation = unit.doc_sigla;
        const teachers: ScheduleTeacher[] = unit.docentes.map((t) => ({ id: t.doc_codigo, name: t.doc_nome }));
        const classes: ScheduleClass[] = unit.turmas.map((t) => ({ id: t.turma_id, name: t.turma_sigla }));
        
        const day = daysOfTheWeek[unit.dia - 1]!;
        const courseId = unit.ocorrencia_id;
        
        schedule.addUnit(day, courseId, { start, end, course, type, teachersAbbreviation, teachers, classes });
    }

    return schedule;
}