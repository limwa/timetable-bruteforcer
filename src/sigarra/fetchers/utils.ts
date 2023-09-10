export function throwIfNotOk(response: Response) {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
}