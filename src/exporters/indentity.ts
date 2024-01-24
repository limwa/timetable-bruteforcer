import { Exporter } from "@/exporters/types.ts";
import { Schedule } from "@/models/schedule.ts";

export function identity(): Exporter<Schedule> {
    return (schedule) => schedule;
}