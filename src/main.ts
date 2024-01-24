import { cliffy } from "@/deps.ts";
const { Select } = cliffy;

import * as env from "@/env.ts";
import * as api from "@/sigarra/api/mod.ts";
import * as config from "../config/mod.ts";

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
  const vars = await env.load();
  
  const username = vars.SI_USERNAME;
  const password = vars.SI_PASSWORD;

  const result = await api.authenticate(username, password);
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
        if (type !== "TP" && type !== "PL" && type !== "OT") continue;

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

  try {
    Deno.removeSync("./output", { recursive: true })
  } catch (_) {
    // If the directory doesn't exist, it's fine
  }

  Deno.mkdirSync("./output", { recursive: true });

  const report = Deno.openSync("./output/report.csv", { create: true, write: true, truncate: true });
  const encoder = new TextEncoderStream();
  encoder.readable.pipeTo(report.writable);

  const writer = encoder.writable.getWriter();
  writer.write("Option");
  for (const [_, course] of courses) {
    writer.write(`,${course.abbreviation},`);
  }

  writer.write('\n');
  for (const _ of courses) {
    writer.write(',Teacher,Class');
  }

  writer.write('\n');

  let count = 1;
  for (const combination of combinations(options)) {
    let schedule = new Schedule();
    for (const [courseId, classId] of combination) {
      const classSchedule = courses.byKey(courseId)!.wantedClasses.byKey(classId)!.schedule;
      schedule = schedule.merge(classSchedule);
    }

    if (schedule.validate()) {
      const dailySchedule = DailySchedule.fromSchedule(schedule) as DailySchedule;

      writer.write(`${count}`);
      for (const [_, course] of courses) {
        const teachers: string[] = [];
        for (const [_, dailySchedule] of course.wantedClasses.byKey(combination.get(course.id)!)!.schedule) {
          for (const [_, units] of dailySchedule) {
            for (const unit of units) {
              if (unit.type !== "TP" && unit.type !== "PL" && unit.type !== "OT") continue;

              for (const teacher of unit.teachers) {
                teachers.push(course.wantedTeachers.byKey(teacher.id)!.abbreviation);
              }
            }
          }
        }

        writer.write(`,${teachers.join("/")},${course.wantedClasses.byKey(combination.get(course.id)!)!.name}`);
      }
      writer.write('\n');

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

  await writer.close();
}
