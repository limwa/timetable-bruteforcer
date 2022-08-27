import { withAuthentication } from "../../cookies.ts";
import parseAuthentication from "../../../parser/authentication/api/mod.ts";

export function authenticate(username: string, password: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_VAL_GERAL.AUTENTICA");

    return withAuthentication(url.toString(), {
        method: "POST",
        body: new URLSearchParams({
            pv_login: username,
            pv_password: password,
        }),
    })
        .then((response) => response.text())
        .then(parseAuthentication)
}