import { z } from "@/deps.ts";

export const zUnitType = z.enum(["T", "TP", "P", "L", "PL", "OT"])
export type UnitType = z.infer<typeof zUnitType>;