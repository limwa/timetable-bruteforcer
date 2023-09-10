import { fetchWithAuthentication } from "@/sigarra/fetcher/client.ts";
import { throwIfNotOk } from "@/sigarra/fetcher/utils.ts";
import parseSchedule from "@/sigarra/parsers/schedule/api/mod.ts";

export function getClassSchedule(classId: string, start: string, end: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_HOR_GERAL.TURMA");
    url.searchParams.set("pv_turma_id", classId);
    url.searchParams.set("pv_semana_ini", start);
    url.searchParams.set("pv_semana_fim", end);

    return fetchWithAuthentication(url.toString())
        .then(throwIfNotOk)
        .then((response) => response.json())
        .then(parseSchedule);
}