// https://sigarra.up.pt/feup/pt/MOB_hor_GERAL.turma?pv_turma_id=211021&pv_semana_ini=20220102&pv_semana_fim=20220102
import { withAuthentication } from "../../../cookies.ts";
import parseSchedule from "../../../../parser/schedule/api/mod.ts";

export function getClassSchedule(classId: string, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_hor_GERAL.turma");
    url.searchParams.set("pv_turma_id", classId);
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSchedule);
}