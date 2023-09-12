import parseCourseSearchResults from "@/sigarra/api/parsers/search/courses.ts";
import { collectAllSearchResults } from "@/sigarra/api/search/utils.ts";
import { Course } from "@/models/course.ts";

export function getCoursesByAbreviation(abbreviation: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA");
    url.searchParams.set("pv_uc_sigla", abbreviation);

    return collectAllSearchResults(url, parseCourseSearchResults)
}

export async function getCourseById(id: Course["id"]) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA");
    url.searchParams.set("pv_codigo", id.toString(10));

    const courses = await collectAllSearchResults(url, parseCourseSearchResults);
    if (courses.length !== 1) {
        throw new Error(`Expected 1 course with id ${id}, got ${courses.length}`);
    }

    return courses[0]!;
}