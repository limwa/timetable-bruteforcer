// https://sigarra.up.pt/feup/pt/MOB_val_geral.autentica?pv_login=202008169&pv_password=
import { withAuthentication } from "../../cookies.ts";
import parseAuthentication from "../../../parser/authentication/api/mod.ts";

export function authenticate(username: string, password: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_val_geral.autentica");
    url.searchParams.set("pv_login", username);
    url.searchParams.set("pv_password", password);

    return withAuthentication(url.toString())
        .then((response) => response.text())
        .then(parseAuthentication)
}