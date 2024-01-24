import { Schedule } from "@/models/schedule.ts";

export type Exporter<TResult> = (schedule: Schedule, index: number) => TResult | Promise<TResult>
