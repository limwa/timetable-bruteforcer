import { OrderedArray } from "@/collections/ordered-array.ts";
import { Unit } from "@/models/unit.ts";
import { DayOfTheWeek, daysOfTheWeek } from "@/utils/days.ts";

export class Schedule {

    private days: Record<DayOfTheWeek, OrderedArray<Unit>>;

    constructor() {
        const compareUnits = (a: Unit, b: Unit) => a.start - b.start;
        const entries = daysOfTheWeek
            .map(day => [day, new OrderedArray(compareUnits)] as const);

        this.days = Object.fromEntries(entries) as Record<DayOfTheWeek, OrderedArray<Unit>>;
    }

    public [Symbol.iterator]() {
        const dayIterator = daysOfTheWeek[Symbol.iterator]();
        return {
            next: () => {
                const { done, value: day } = dayIterator.next();
                
                if (done) {
                    return {
                        done: true,
                        value: undefined
                    };
                }

                return {
                    done: false,
                    value: [day, this.days[day]]
                };
            }
        } as Iterator<[DayOfTheWeek, OrderedArray<Unit>]>;
    }

    public addUnit(day: DayOfTheWeek, unit: Unit) {
        this.days[day].push(unit);
    }
    
    public isValid() {
        for (const [_, units] of this) {
            let lastEnd = 0;

            for (const unit of units) {
                if (unit.start < lastEnd) {
                    return false;
                }

                lastEnd = unit.end;
            }
        }

        return true;
    }

    public merge(other: Schedule) {
        const merged = new Schedule();

        for (const [day, units] of merged) {
            units.addAll(this.days[day]);
            units.addAll(other.days[day]);
        }

        return merged;
    }
}