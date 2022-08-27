import { Schedule, ScheduleTeacher, ScheduleClass, ScheduleUnitTypes } from "../../../model/schedule.ts";
import { schema } from "./schema.ts";
import { daysOfTheWeek } from "../../../utils/days.ts";

export default function parse(data: string) {
    const res = schema.parse(JSON.parse(data));
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
        
        const day = daysOfTheWeek[unit.dia - 1];
        const courseId = unit.ocorrencia_id;
        
        schedule.addUnit(day, courseId, { start, end, course, type, teachersAbbreviation, teachers, classes });
    }

    return schedule;
}