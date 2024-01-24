import { Exporter } from "@/exporters/types.ts";
import { Schedule } from "@/models/schedule.ts";
import { daysOfTheWeek } from "@/utils/days.ts";

type CsvOptions = {
  separator?: string;
};

type CSVExporterOptions = CsvOptions & (
  | { output: "stdout" }
  | { output: "file"; directory?: string });

function capitalize(str: string) {
  return str.charAt(0).toUpperCase().concat(str.slice(1));
}

function getReadableTimestamp(timestamp: number) {
  const hours = Math.floor(timestamp / 60);
  const paddedHours = hours.toString(10).padStart(2, "0");

  const minutes = timestamp % 60;
  const paddedMinutes = minutes.toString(10).padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}`;
}

function getScheduleTimeRange(schedule: Schedule) {
  let start = Number.POSITIVE_INFINITY;
  let end = Number.NEGATIVE_INFINITY;

  for (const [_day, daySchedule] of schedule) {
    if (daySchedule.length === 0) continue;

    const first = daySchedule.at(0)!;
    const last = daySchedule.at(-1)!;

    // BEAWARE: this only works if there are no overlapping units
    start = Math.min(start, first.start);
    end = Math.max(end, last.end);
  }

  return [start, end] as const;
}

function* getCsvFromSchedule(
  schedule: Schedule,
  { separator = "," }: CsvOptions
) {
  const header = ["Time", ...daysOfTheWeek.map(capitalize)];

  yield header.join(separator);
  yield "\n";

  const [start, end] = getScheduleTimeRange(schedule);

  for (let i = start; i <= end; i += 30) {
    const slotStart = i;
    const slotEnd = i + 30;

    const slotStartText = getReadableTimestamp(slotStart);
    const slotEndText = getReadableTimestamp(slotEnd);
    yield `${slotStartText} - ${slotEndText}`;

    for (const [_, daySchedule] of schedule) {
      yield separator;

      for (const unit of daySchedule) {
        if (unit.start === slotStart) {
          const unitTeachers = unit.teachers
            .map((unitTeacher) => unitTeacher.abbreviation)
            .join("+");

          const unitClasses = unit.classes
            .map((unitClass) => unitClass.name)
            .join("+");

          yield `${unit.course.code} w/ ${unitTeachers} (${unit.type}) [${unitClasses}]`;
          break;
        } else if (unit.end === slotEnd) {
          yield `End of ${unit.course.code}`;
          break;
        }
      }

      yield "\n";
    }
  }

  return;
}

export function csv(options: CSVExporterOptions): Exporter<void> {
    const { separator } = options;

    if (options.output === "stdout") {
        return (schedule) => {
            const scheduleCsv = getCsvFromSchedule(schedule, {
                separator,
            });

            for (const text of scheduleCsv) {
                console.log(text);
            }

            console.log("---");
        }
    } else if (options.output === "file") {

        const outputDir = options.directory ?? "output";
        Deno.mkdirSync(outputDir, { recursive: true });

        return async (schedule, index) => {
            // FIXME: use path module
            const fd = await Deno.open(`${outputDir}/${index}.csv`, {
                create: true,
                truncate: true,
            });

            try {
                const scheduleCsv = getCsvFromSchedule(schedule, {
                    separator,
                });
                
                const encoder = new TextEncoder();
                for (const text of scheduleCsv) {
                    await fd.write(encoder.encode(text));
                }
            } finally {
                fd.close();
            }
        }
    }

    throw new Error("Unsupported output mode");
}
