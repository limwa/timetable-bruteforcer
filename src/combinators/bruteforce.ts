import { Combinator } from "@/combinators/types.ts";
import { Schedule } from "@/models/schedule.ts";

export const bruteforce: Combinator = function*(options) {
    const result = options.next();
    if (result.done) {
        return yield new Schedule();
    }

    const schedules = result.value;
  
    const otherCombinations = bruteforce(options);
    for (const combination of otherCombinations) {
        const copy = structuredClone(combination) as Schedule;

        for (const possibility of schedules) {
            copy.merge(possibility);
            if (copy.isValid()) {
                yield copy;
            }
        }
    }

    return;
}
