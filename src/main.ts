import * as env from "https://deno.land/std@0.153.0/dotenv/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v0.24.3/prompt/mod.ts";
import { authenticate } from "./fetcher/authentication/api/mod.ts";
import { getTeachersByAbbreviation } from "./fetcher/search/teachers/api/mod.ts";
import { getCoursesByAbreviation } from "./fetcher/search/courses/api/mod.ts";

import { DailySchedule, Schedule, ScheduleClass } from "./model/schedule.ts";
import { Teacher } from "./parser/search/teachers/types.d.ts";
import { Course } from "./parser/search/courses/types.d.ts";

import { teachers as config, start, end } from "../config/mod.ts";
import { getCourseSchedule } from "./fetcher/schedule/courses/api/mod.ts";
import { daysOfTheWeek } from "./utils/days.ts";
import { numberSetw2 } from "./utils/numberSetw.ts";

type BruteforcerTeacher = Teacher;
type BruteforcerClass = ScheduleClass & {
  schedule: Schedule;
};
type BruteforcerCourse = Course & {
  abbreviation: string;
  wantedTeachers: BruteforcerRecord<BruteforcerTeacher>;
  wantedClasses: BruteforcerRecord<BruteforcerClass>;
};

class BruteforcerRecord<T extends Record<string, unknown>> implements Iterable<[unknown, T]> {

  private key: string;
  private values: Map<unknown, T>;

  private index: Map<string, Map<unknown, unknown>>;

  constructor(key: string, indices: string[]) {
    this.key = key;
    this.values = new Map();

    this.index = new Map();
    for (const index of indices) {
      this.index.set(index, new Map());
    }
  }

  [Symbol.iterator]() {
    return this.values.entries();
  }

  public byKey(key: unknown) {
    return this.values.get(key);
  }

  public by(index: string, value: unknown) {
    if (!this.index.has(index)) throw new Error(`Cannot index by ${index}`);
    const correspondence = this.index.get(index)!;
    const key = correspondence.get(value);

    if (!key) return undefined;
    return this.values.get(key);
  }

  public push(value: T) {
    for(const [indexKey, index] of this.index) {
      index.set(value[indexKey], value[this.key]);
    }

    return this.values.set(value[this.key], value);
  }

  public hasKey(key: unknown) {
    return this.values.has(key);
  }

  public has(index: string, value: T) {
    return this.index.get(index)?.has(value) ?? false;
  }
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

async function selectCourseFromList(courses: Course[], abbreviation: string){
  if (courses.length === 1) return courses[0];

  const res = await Select.prompt({
    message: `Select the course ${abbreviation}:`,
    options: courses.map((t) => ({
      name: `[${t.code}] ${t.name} (${t.year} / ${t.year + 1})`,
      value: JSON.stringify(t),
    }))
  });

  return JSON.parse(res) as Course;
}

function* combinations<T extends string | number, U>(options: Map<T, U[]>): Generator<Map<T, U>> {
  if (options.size === 0) {
    return yield new Map();
  }

  const [key, classes] = options.entries().next().value as [T, U[]];

  const remainingOptions = new Map(options);
  remainingOptions.delete(key);
  
  const otherCombinations = combinations(remainingOptions);

  for (const combination of otherCombinations) {
    for (const possibility of classes) {
      const newCombination = new Map(combination);
      newCombination.set(key, possibility);

      yield newCombination;
    }
  }
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

  const courses = new BruteforcerRecord<BruteforcerCourse>("id", ["abbreviation"]);
  for (const course in config) {
    const infos = await getCoursesByAbreviation(course);
    if (infos.length === 0) throw new Error(`Could not find course ${course}`);

    const info = await selectCourseFromList(infos, course);
    
    console.log(`Using ${course} => [${info.code}] ${info.name} (${info.year} / ${info.year + 1})`);

    courses.push({
      ...info,
      abbreviation: course,
      wantedClasses: new BruteforcerRecord("id", ["name"]),
      wantedTeachers: new BruteforcerRecord("id", ["abbreviation"]),
    });
  }

  for (const course in config) {
    const teachers = config[course];
    
    for (const teacher of teachers) {
      const infos = await getTeachersByAbbreviation(teacher);
      if (infos.length === 0) throw new Error(`Could not find teacher ${teacher}`);

      const info = await selectTeacherFromList(infos, teacher, course);
      
      console.log(`Using ${info.abbreviation} => ${info.name} for ${course}`);

      const teacherInfos = courses.by("abbreviation", course)!.wantedTeachers;
      teacherInfos.push(info);
    }
  }

  const courseSchedulesById = new Map<number, Schedule>();
  for (const [_, course] of courses) {
    const schedule = await getCourseSchedule(course.id, start, end);

    for (const [_day, daySchedule] of schedule) {
      const dailyCourseSchedule = daySchedule.get(course.id)!;
      for (const { type, teachers, classes } of dailyCourseSchedule) {
        if (type !== "TP" && type !== "PL") continue;

        if (teachers.some((v) => course.wantedTeachers.hasKey(v.id))) {
          for (const classInfo of classes) {
            course.wantedClasses.push({
              ...classInfo,
              schedule: schedule.filterByClassId(classInfo.id),
            });
          }
        }
      }
    }

    courseSchedulesById.set(course.id, schedule);
  }

  const options = new Map<number, number[]>();
  for (const [_, course] of courses) {
    options.set(course.id, []);
    for (const [_, classInfo] of course.wantedClasses) {
      options.get(course.id)!.push(classInfo.id);
    }
  }

  Deno.removeSync("./output", { recursive: true });
  Deno.mkdirSync("./output", { recursive: true });

  let count = 1;
  for (const combination of combinations(options)) {
    let schedule = new Schedule();
    for (const [courseId, classId] of combination) {
      const classSchedule = courses.byKey(courseId)!.wantedClasses.byKey(classId)!.schedule;
      schedule = schedule.merge(classSchedule);
    }

    if (schedule.validate()) {
      const dailySchedule = DailySchedule.fromSchedule(schedule) as DailySchedule;

      let start = 999999, end = 0;
      for (const [_day, daySchedule] of dailySchedule) {
        for (const unit of daySchedule) {
          start = Math.min(start, unit.start);
          end = Math.max(end, unit.end);
        }
      }

      const header = ["Horas", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
      const rows = [];

      for (let i = start; i <= end; i += 30) {
        const row = [];
        row.push(`${numberSetw2(Math.floor(i / 60))}:${numberSetw2(Math.floor(i % 60))} - ${numberSetw2(Math.floor((i + 30) / 60))}:${numberSetw2(Math.floor((i + 30) % 60))}`);

        for (const day of daysOfTheWeek) {
          const daySchedule = dailySchedule.get(day);
          if (!daySchedule) continue;

          let hasAdded = false;
          for (const unit of daySchedule) {
            const courseInfo = courses.by("abbreviation", unit.course)!;
            if (unit.start === i) {
              row.push(`${unit.course} w/ ${unit.teachersAbbreviation} (${unit.type}) [${courseInfo.wantedClasses.byKey(combination.get(courseInfo.id)!)!.name}]`);
              hasAdded = true;
            } else if (unit.end - 30 === i) {
              row.push(`End of ${unit.course}`);
              hasAdded = true;
            }
          }

          if (!hasAdded) row.push("");
        }

        rows.push(row);
      }

      const content = `${header.join(",")}\n${rows.map((row) => row.join(",")).join("\n")}`;
      Deno.writeTextFileSync(`./output/${count}.csv`, content);

      count++;
    }
  }

}
