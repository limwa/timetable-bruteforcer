import { schema } from "./schema.ts";

export default function parse(data: string) {
    const res = schema.parse(JSON.parse(data));

    return res.authenticated ?
        { authenticated: true } :
        { authenticated: false, error: res.erro_msg };
}