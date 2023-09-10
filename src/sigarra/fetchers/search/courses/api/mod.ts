import { fetchWithAuthentication } from "@/sigarra/fetchers/client.ts";
import { throwIfNotOk } from "@/sigarra/fetchers/utils.ts";
import parseCourseSearchResults from "@/sigarra/parsers/search/courses/api/mod.ts";

export async function getCoursesByAbreviation(abbreviation: string) {
    const courses: ReturnType<typeof parseCourseSearchResults> = [];

    let page = 1;
    while (true) {
        const url = new URL("https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA");
        url.searchParams.set("pv_uc_sigla", abbreviation);
        url.searchParams.set("pv_pag", page.toString(10));

        const pageCourses = await fetchWithAuthentication(url.toString())
            .then(throwIfNotOk)
            .then((response) => response.json())
            .then(parseCourseSearchResults);

        courses.push(...pageCourses);
        page++;
        
        if (pageCourses.length === 0) {
            break;
        }
    }

    return courses;
}