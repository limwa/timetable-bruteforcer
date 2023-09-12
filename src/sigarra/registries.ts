import { Registry } from "@/collections/registry.ts";
import * as api from "./api/mod.ts";

export const teacherRegistry = new Registry(api.getTeacherById);
export const courseRegistry = new Registry(api.getCourseById);