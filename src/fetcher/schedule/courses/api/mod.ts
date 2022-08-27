import { withAuthentication } from "../../../cookies.ts";
import parseSchedule from "../../../../parser/schedule/api/mod.ts";

export function getCourseSchedule(courseId: number, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_HOR_GERAL.UCURR");
    url.searchParams.set("pv_ocorrencia_id", courseId.toString(10));
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSchedule);
}