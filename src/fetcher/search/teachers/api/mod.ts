import { withAuthentication } from "../../../cookies.ts";
import parseSearchResults from "../../../../parser/search/teachers/api/mod.ts";

export function getTeachersByAbbreviation(abbreviation: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_FUNC_GERAL.PESQUISA");
    url.searchParams.set("pv_sigla", abbreviation);
    url.searchParams.set("pv_estado", "");

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSearchResults);
}