import { withAuthentication } from "../../../cookies.ts";
import parseSearchResults from "../../../../parser/search/courses/api/mod.ts";
import { Course } from "../../../../parser/search/courses/types.d.ts";

export async function getCoursesByAbreviation(abbreviation: string) {
    const courses: Course[] = [];

    let page = 1;
    while (true) {
        const url = new URL("https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA");
        url.searchParams.set("pv_uc_sigla", abbreviation);
        url.searchParams.set("pv_pag", page.toString(10));

        const pageCourses = await withAuthentication(url.toString())
            .then((response) => response.text())
            .then(parseSearchResults);

        courses.push(...pageCourses);
        page++;
        
        if (pageCourses.length === 0) {
            break;
        }
    }

    return courses;
}