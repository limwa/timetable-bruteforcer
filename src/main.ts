import * as env from "https://deno.land/std@0.153.0/dotenv/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v0.24.3/prompt/mod.ts";
import { authenticate } from "./fetcher/authentication/api/mod.ts";
import { getTeacherFromAbbreviation } from "./fetcher/search/teachers/api/mod.ts";
import { getTeacherSchedule } from "./fetcher/schedule/teacher/api/mod.ts";

import { Schedule } from "./model/schedule.ts";
import { Teacher } from "./parser/search/teachers/types.d.ts";

import { teachers as config, start, end } from "../config/mod.ts";
import { getClassSchedule } from "./fetcher/schedule/class/api/mod.ts";

function getClassesTaught(schedule: Schedule, course: string) {
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

async function selectTeacherFromList(teachers: Teacher[], abbreviation: string, courseName: string){
  if (teachers.length === 1) return teachers[0];

  const res = await Select.prompt({
    message: `Select the teacher ${abbreviation} for ${courseName}:`,
    options: teachers.map((t) => ({
      name: t.name,
      value: JSON.stringify(t),
    }))
  });

  return JSON.parse(res) as Teacher;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const vars = env.configSync();
  
  const username = vars.SI_USERNAME;
  const password = vars.SI_PASSWORD;

  const result = await authenticate(username, password);
  if (!result.authenticated) {
    console.error("Login failed. Please update your .env file.");
    throw new Error(result.error);
  }

  // Get a list of what courses are required for each teacher
  const coursesByTeacher = new Map<string, string[]>();
  for (const course in config) {
    const teachers = config[course];
    
    for (const teacher of teachers) {
      if (!coursesByTeacher.has(teacher.toUpperCase())) {
        coursesByTeacher.set(teacher.toUpperCase(), []);
      }

      const courses = coursesByTeacher.get(teacher.toUpperCase())!;
      courses.push(course);
    }
  }

  // A correspondence between each course and the classes that would have it taught by one of the requested teachers 
  const courseClasses = new Map<string, number[]>();

  for (const [abbreviation, courses] of coursesByTeacher) {
    const teachers = await getTeacherFromAbbreviation(abbreviation);
    if (teachers.length === 0) throw new Error(`Teacher ${abbreviation} not found`);

      for (const course of courses) {
        const teacher = await selectTeacherFromList(teachers, abbreviation, course);

        console.log(`Using ${abbreviation} => ${teacher.name} for ${course}`);

        const schedule = await getTeacherSchedule(teacher.id, start, end);
        const classes = getClassesTaught(schedule, course);

        if (!courseClasses.has(course)) {
          courseClasses.set(course, []);
        }

        const courseSchedule = courseClasses.get(course)!;
        for (const courseClass of classes.values()) {
          courseSchedule.push(courseClass);
        }
    }
  }

  const courseSchedules = new Map<string, Schedule[]>();
  for (const [course, classes] of courseClasses) {
    for (const classId of classes) {
      const schedule = await getClassSchedule(classId, start, end);

      if (!courseSchedules.has(course)) {
        courseSchedules.set(course, []);
      }

      const courseSchedule = courseSchedules.get(course)!;
      courseSchedule.push(schedule.filter(course));
    }
  }
  
  console.log(courseSchedules)
}
