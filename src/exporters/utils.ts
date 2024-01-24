export type StreamOptions =
    | { type: "stdout", separator?: string }
    | { type: "file", name: string };

type StdoutStreamOptions = Omit<StreamOptions & { type: "stdout" }, "type">;
type FileStreamOptions = Omit<StreamOptions & { type: "file" }, "type">;

function createWritableStdoutStream({ separator = "\n" }: StdoutStreamOptions): ReturnType<typeof createWritableStream> {
    const stream = new WritableStream((e) => {
Deno.stdout.writable
    })
}

export function createWritableStream(options: StreamOptions): WritableStream<string> {
    
}