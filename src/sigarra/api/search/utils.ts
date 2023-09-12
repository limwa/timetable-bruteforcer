import { fetchWithAuthentication } from "@/sigarra/client.ts";
import { throwIfNotOk } from "@/sigarra/utils.ts";

export async function collectAllSearchResults<T>(baseUrl: URL, parseSearchResults: (data: unknown) => T[]) {
    const results: ReturnType<typeof parseSearchResults> = [];

    let page = 1;
    while (true) {
        const url = new URL(baseUrl);
        url.searchParams.set("pv_pag", page.toString(10));

        const pageResults = await fetchWithAuthentication(url)
            .then(throwIfNotOk)
            .then((response) => response.json())
            .then(parseSearchResults);

        results.push(...pageResults);
        page++;
        
        if (pageResults.length === 0) {
            break;
        }
    }

    return results;
}