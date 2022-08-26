import { CookieJar, wrapFetch } from "https://deno.land/x/another_cookiejar@v4.1.4/mod.ts";

export const cookieJar = new CookieJar();
export const withAuthentication = wrapFetch({ cookieJar });
