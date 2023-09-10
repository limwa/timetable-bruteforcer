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

export const cookieJar = new CookieJar();
export const fetchWithAuthentication = wrapFetch({
  cookieJar,
  fetch: fetchWithCustomUserAgent,
});
