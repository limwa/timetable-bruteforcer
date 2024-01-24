import parseTeacherSearchResults from "@/sigarra/api/parsers/search/teachers.ts";
import { Teacher } from "@/models/teacher.ts";
import { collectAllSearchResults } from "@/sigarra/api/search/utils.ts";

export function getTeachersByAbbreviation(abbreviation: Teacher["abbreviation"]) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_FUNC_GERAL.PESQUISA");
    url.searchParams.set("pv_sigla", abbreviation);
    url.searchParams.set("pv_estado", "");

    return collectAllSearchResults(url, parseTeacherSearchResults);
}

export async function getTeacherById(id: Teacher["id"]) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_FUNC_GERAL.PESQUISA");
    url.searchParams.set("pv_codigo", id);

    const teachers = await collectAllSearchResults(url, parseTeacherSearchResults);
    if (teachers.length !== 1) {
        throw new Error(`Expected 1 teacher with id ${id}, got ${teachers.length}`);
    }

    return teachers[0]!;
}