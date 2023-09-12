import { Course } from "@/models/course.ts";
import { Teacher } from "@/models/teacher.ts";
import { Class } from "@/models/class.ts";
import { UnitType } from "@/utils/zod.ts";

export class Unit {
    
    readonly start: number;
    readonly end: number;
    readonly type: UnitType;
    readonly course: Course;
    readonly teachers: Teacher[];
    readonly classes: Class[];
    
    constructor({ start, end, type, course, teachers, classes }: Unit) {
        this.start = start;
        this.end = end;
        this.type = type;
        this.course = course;
        this.teachers = [...teachers];
        this.classes = [...classes];
    }
}