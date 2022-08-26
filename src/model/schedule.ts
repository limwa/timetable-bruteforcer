import { DayOfTheWeek } from "../utils/days.ts";

export type ScheduleUnitTypes = "T" | "TP" | "PL";

export type ScheduleTeacher = {
    id: string;
    name: string;
}

export type ScheduleClass = {
    id: number;
    name: string;
}

export type ScheduleUnit = {
  start: number;
  end: number;
  type: ScheduleUnitTypes;
  teachers: ScheduleTeacher[];
  classes: ScheduleClass[];
};

export class Schedule implements Iterable<[DayOfTheWeek, Map<string, ScheduleUnit[]>]> {

    private schedule: Map<DayOfTheWeek, Map<string, ScheduleUnit[]>>;
    
    constructor() {
        this.schedule = new Map();
    }

    public [Symbol.iterator]() {
        return this.schedule.entries();
    }
    
    public addUnit(day: DayOfTheWeek, courseName: string, unit: ScheduleUnit) {
        if (this.overlaps(day, unit)) return false;

        if (!this.schedule.has(day)) {
            this.schedule.set(day, new Map());
        }
    
        const daySchedule = this.schedule.get(day)!

        if (!daySchedule.has(courseName)) {
            daySchedule.set(courseName, []);
        }

        const unitSchedule = daySchedule.get(courseName)!;
        
        let index;
        for (index = 0; index < unitSchedule.length; index++) {
            const currentUnit = unitSchedule[index];
            if (unit.start < currentUnit.start) break;
        }

        unitSchedule.splice(index, 0, unit);
        return true;
    }

    public overlaps(day: DayOfTheWeek, unit: ScheduleUnit) {
        if (!this.isValidInformation(unit)) throw new Error("Invalid unit");
        if (!this.schedule.has(day)) return false;

        const daySchedule = this.schedule.get(day)!;
        for (const courseSchedule of daySchedule.values()) {
            for (const otherUnit of courseSchedule) {

                const { start, end } = unit;
                const { start: otherStart, end: otherEnd } = otherUnit;

                // For two lines to not overlap, one of the following must be true:
                // 1. The start and end of the one line is before the start of the other line
                // 2. The start and end of the one line is after the end of the other line

                const noOverlap = (start < otherStart && end <= otherStart) || (start >= otherEnd && end > otherEnd);
                if (!noOverlap) return true;                
            }
        }
        
        return true;
    }

    public filter(courseName: string) {
        const filteredSchedule = new Schedule();

        for (const [day, daySchedule] of this.schedule) {
            if (daySchedule.has(courseName)) {
                const units = daySchedule.get(courseName)!;
                for (const unit of units) {
                    filteredSchedule.addUnit(day, courseName, unit);
                }
            }
        }

        return filteredSchedule;
    }

    private isValidInformation(information: ScheduleUnit) {
        const { start, end } = information;
        return start < end;
    }
}