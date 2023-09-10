import { fetchWithAuthentication } from "@/sigarra/fetchers/client.ts";
import { throwIfNotOk } from "@/sigarra/fetchers/utils.ts";
import parseTeacherSearchResults from "@/sigarra/parsers/search/teachers/api/mod.ts";

export async function getTeachersByAbbreviation(abbreviation: string) {
    const teachers: ReturnType<typeof parseTeacherSearchResults> = [];

    let page = 1;
    while (true) {
        const url = new URL("https://sigarra.up.pt/feup/pt/MOB_FUNC_GERAL.PESQUISA");
        url.searchParams.set("pv_sigla", abbreviation);
        url.searchParams.set("pv_estado", "");
        url.searchParams.set("pv_pag", page.toString(10));

        const pageTeachers = await fetchWithAuthentication(url.toString())
            .then(throwIfNotOk)
            .then((response) => response.json())
            .then(parseTeacherSearchResults);

        teachers.push(...pageTeachers);
        page++;
        
        if (pageTeachers.length === 0) {
            break;
        }
    }

    return teachers;
}