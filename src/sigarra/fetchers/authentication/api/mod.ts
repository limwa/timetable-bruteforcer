import { fetchWithAuthentication } from "@/sigarra/fetcher/client.ts";
import { throwIfNotOk } from "@/sigarra/fetcher/utils.ts";
import parseAuthentication from "@/sigarra/parser/authentication/api/mod.ts";

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