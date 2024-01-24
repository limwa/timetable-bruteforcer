import { fetchWithAuthentication } from "@/sigarra/client.ts"
import { throwIfNotOk } from "@/sigarra/utils.ts";
import parseSchedule from "@/sigarra/api/parsers/schedule.ts";

export function getCourseSchedule(courseId: number, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_HOR_GERAL.UCURR");
    url.searchParams.set("pv_ocorrencia_id", courseId.toString(10));
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return fetchWithAuthentication(url)
        .then(throwIfNotOk)
        .then((response) => response.json())
        .then(parseSchedule);
}