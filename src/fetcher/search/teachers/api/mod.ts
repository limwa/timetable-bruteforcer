// https://sigarra.up.pt/feup/pt/MOB_func_GERAL.pesquisa?pv_codigo=211847
import { withAuthentication } from "../../../cookies.ts";
import parseSearchResults from "../../../../parser/search/teachers/api/mod.ts";

export function getTeacherFromAbbreviation(abbreviation: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_FUNC_GERAL.PESQUISA");
    url.searchParams.set("pv_sigla", abbreviation);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseSearchResults);
}