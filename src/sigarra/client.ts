import { anotherCookieJar } from "@/deps.ts";

const { CookieJar, wrapFetch } = anotherCookieJar;

const fetchWithCustomUserAgent: typeof fetch = (input, init) =>
    fetch(input, {
        ...init,
        headers: {
            ...init?.headers,
            "User-Agent": "TimetableBruteforcer/1.0.0",
        },
    });

const fetchWithLogging: typeof fetch = (input, init) => {
    console.log(`${init?.method ?? 'GET'} ${input.toString()}`);
    return fetchWithCustomUserAgent(input, init);
}

export const cookieJar = new CookieJar();
export const fetchWithAuthentication = wrapFetch({
  cookieJar,
  fetch: fetchWithLogging,
});
