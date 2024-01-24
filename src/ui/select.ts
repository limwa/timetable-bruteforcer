import { cliffy } from "@/deps.ts";
const { Select } = cliffy;

export async function selectFromList<T>(prompt: string, values: T[], display: (value: T) => string): Promise<T> {
    const index = await Select.prompt({
        message: prompt,
        options: values.map((value, index) => ({
            name: display(value),
            value: index.toString(10),
        }))
    });

    return values[parseInt(index, 10)]!;
}