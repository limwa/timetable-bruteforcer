// https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA?pv_uc_sigla=AED
import { withAuthentication } from "../../../cookies.ts";
import parseSearchResults from "../../../../parser/search/courses/api/mod.ts";

export function getCoursesByAbreviation(abbreviation: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_UCURR_GERAL.PESQUISA");
    url.searchParams.set("pv_uc_sigla", abbreviation);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSearchResults);
}