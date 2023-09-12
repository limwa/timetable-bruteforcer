// import { DayOfTheWeek } from "@/utils/days.ts";

// export type ScheduleUnitTypes = "T" | "TP" | "PL" | "OT";

// export type ScheduleTeacher = {
//     id: string;
//     name: string;
// }

// export type ScheduleClass = {
//     id: number;
//     name: string;
// }

// export type ScheduleUnit = {
//   start: number;
//   end: number;
//   course: string;
//   teachersAbbreviation: string;
//   type: ScheduleUnitTypes;
//   teachers: ScheduleTeacher[];
//   classes: ScheduleClass[];
// };

// export class Schedule implements Iterable<[DayOfTheWeek, Map<number, ScheduleUnit[]>]> {

//     private schedule: Map<DayOfTheWeek, Map<number, ScheduleUnit[]>>;
    
//     constructor() {
//         this.schedule = new Map();
//     }

//     public [Symbol.iterator]() {
//         return this.schedule.entries();
//     }
    
//     public addUnit(day: DayOfTheWeek, courseId: number, unit: ScheduleUnit) {
//         if (!this.schedule.has(day)) {
//             this.schedule.set(day, new Map());
//         }
    
//         const daySchedule = this.schedule.get(day)!

//         if (!daySchedule.has(courseId)) {
//             daySchedule.set(courseId, []);
//         }

//         const unitSchedule = daySchedule.get(courseId)!;
        
//         let index;
//         for (index = 0; index < unitSchedule.length; index++) {
//             const currentUnit = unitSchedule[index];
//             if (unit.start < currentUnit.start) break;
//         }

//         unitSchedule.splice(index, 0, unit);
//         return true;
//     }



//     public validate() {
//         return DailySchedule.fromSchedule(this) && true; 
//     }

//     public merge(other: Schedule) {
//         const newSchedule = new Schedule();

//         for (const [day, daySchedule] of this.schedule) {
//             for (const [courseId, courseSchedule] of daySchedule) {
//                 for (const unit of courseSchedule) {
//                     newSchedule.addUnit(day, courseId, unit);
//                 }
//             }
//         }

//         for (const [day, daySchedule] of other.schedule) {
//             for (const [courseId, courseSchedule] of daySchedule) {
//                 for (const unit of courseSchedule) {
//                     newSchedule.addUnit(day, courseId, unit);
//                 }
//             }
//         }

//         return newSchedule;
//     }

//     public filterByClassId(classId: number) {
//         const filteredSchedule = new Schedule();

//         for (const [day, daySchedule] of this.schedule) {
//             for (const [courseId, courseSchedule] of daySchedule) {
//                 for (const unit of courseSchedule) {
//                     if (unit.classes.some((v) => v.id === classId)) {
//                         filteredSchedule.addUnit(day, courseId, unit);
//                     }
//                 }
//             }
//         }

//         return filteredSchedule;
//     }

//     private isValidInformation(information: ScheduleUnit) {
//         const { start, end } = information;
//         return start < end;
//     }
// }

// export class DailySchedule implements Iterable<[DayOfTheWeek, ScheduleUnit[]]> {

//     private schedule: Map<DayOfTheWeek, ScheduleUnit[]>;

//     constructor() {
//         this.schedule = new Map();
//     }

//     [Symbol.iterator]() {
//         return this.schedule.entries();
//     }

//     public get(day: DayOfTheWeek): ScheduleUnit[] | undefined {
//         return this.schedule.get(day);
//     }

//     public static fromSchedule(schedule: Schedule) {
//         const result = new DailySchedule();

//         for (const [day, daySchedule] of schedule) {

//             const dayResult: ScheduleUnit[] = [];

//             const it = daySchedule.entries();
//             let current = it.next();

//             while (!current.done) {
//                 let ptr = 0;

//                 const [_, courseSchedule] = current.value;
                
//                 for (const unit of courseSchedule) {
//                     while (ptr < dayResult.length && dayResult[ptr].start < unit.start) {
//                         ptr++;
//                     }

//                     const previous = ptr > 0 ? dayResult[ptr - 1] : null;
//                     const next = ptr < dayResult.length ? dayResult[ptr] : null;

//                     if (previous && previous.end > unit.start || next && next.start < unit.end) {
//                         return false;
//                     }

//                     dayResult.splice(ptr, 0, unit);
//                 }

//                 current = it.next();
//             }

//             result.schedule.set(day, dayResult);
//         }

//         return result;
//     }
// }