import { Registry } from "@/collections/registry.ts";
import * as api from "./api/mod.ts";

// TODO: make this modular, will allow for use in tts, for instance
export const teacherRegistry = new Registry(api.getTeacherById);
export const courseRegistry = new Registry(api.getCourseById);