// https://sigarra.up.pt/feup/pt/MOB_hor_GERAL.docente?pv_codigo=211847&pv_semana_ini=20220101&pv_semana_fim=20220108
import { withAuthentication } from "../../../cookies.ts";
import parseSchedule from "../../../../parser/schedule/api/mod.ts";

export function getTeacherSchedule(teacherId: string, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_hor_GERAL.docente");
    url.searchParams.set("pv_codigo", teacherId);
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSchedule);
}