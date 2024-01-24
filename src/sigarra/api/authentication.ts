import { fetchWithAuthentication } from "@/sigarra/client.ts";
import { throwIfNotOk } from "@/sigarra/utils.ts";
import parseAuthentication from "@/sigarra/api/parsers/authentication.ts";

export function authenticate(username: string, password: string) {
    const url = new URL("https://sigarra.up.pt/feup/pt/MOB_VAL_GERAL.AUTENTICA");

    return fetchWithAuthentication(url.toString(), {
        method: "POST",
        body: new URLSearchParams({
            pv_login: username,
            pv_password: password,
        }),
    })
        .then(throwIfNotOk)
        .then((response) => response.json())
        .then(parseAuthentication)
}