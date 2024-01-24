import { Schedule } from "@/models/schedule.ts";

export type Combinator = (options: Iterator<Schedule[]>) => Generator<Schedule>;
