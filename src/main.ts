import * as env from "https://deno.land/std@0.153.0/dotenv/mod.ts";
import { authenticate } from "./fetcher/authentication/api/mod.ts";
import { getTeacherFromAbbreviation } from "./fetcher/search/teachers/api/mod.ts";
import { getTeacherSchedule } from "./fetcher/schedule/teacher/api/mod.ts";

import { teachers as config, start, end } from "../config/mod.ts";
import { Schedule } from "./model/schedule.ts";

function getClassesTaught(schedule: Schedule, course: string): Set<number> {
  const classes = new Set<number>();

  for (const [_day, daySchedule] of schedule) {
    if (!daySchedule.has(course)) continue;

    const courseSchedule = daySchedule.get(course)!;
    for (const unit of courseSchedule) {
      if (unit.type !== "TP" && unit.type !== "PL") continue;
      unit.classes.forEach((c) => classes.add(c.id));
    }
  }

  return classes;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const vars = env.configSync();
  
  const username = vars.SI_USERNAME;
  const password = vars.SI_PASSWORD;

  const result = await authenticate(username, password);
  if (!result.authenticated) {
    console.error("Invalid credentials. Please update your .env file.");
  }

  // Get a list of what courses are required for each teacher
  const coursesByTeacher = new Map<string, string[]>();
  for (const course in config) {
    const teachers = config[course];
    
    for (const teacher of teachers) {
      if (!coursesByTeacher.has(teacher.toLowerCase())) {
        coursesByTeacher.set(teacher.toLowerCase(), []);
      }

      const courses = coursesByTeacher.get(teacher.toLowerCase())!;
      courses.push(course);
    }
  }

  // A correspondence between each course and the classes that would have it taught by one of the requested teachers 
  const courseSchedules = new Map<string, number[]>();

  for (const [abbreviation, courses] of coursesByTeacher) {
    const teacher = await getTeacherFromAbbreviation(abbreviation);
    if (!teacher) throw new Error(`Teacher ${abbreviation} not found`);

    const schedule = await getTeacherSchedule(teacher.id, start, end);
    for (const course of courses) {
      const classes = getClassesTaught(schedule, course);
      if (!courseSchedules.has(course)) {
        courseSchedules.set(course, []);
      }

      const courseSchedule = courseSchedules.get(course)!;
      for (const courseClass of classes.values()) {
        courseSchedule.push(courseClass);
      }
    }
  }

  console.log(courseSchedules);
}
