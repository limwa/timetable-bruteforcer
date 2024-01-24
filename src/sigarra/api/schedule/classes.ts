import { fetchWithAuthentication } from "@/sigarra/client.ts";
import { throwIfNotOk } from "@/sigarra/utils.ts";
import parseSchedule from "@/sigarra/api/parsers/schedule.ts";

export function getClassSchedule(classId: string, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_HOR_GERAL.TURMA");
    url.searchParams.set("pv_turma_id", classId);
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return fetchWithAuthentication(url)
        .then(throwIfNotOk)
        .then((response) => response.json())
        .then(parseSchedule);
}