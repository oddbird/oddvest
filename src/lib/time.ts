import { TaskSummaries, TimeEntry } from './types';

// summarize an array of TimeEntry to a task-id -> TimeSummary map
// where a TimeSummary is a dev-name -> total-hours map
export const summarizeTimeEntries = (entries: TimeEntry[]): TaskSummaries =>
  entries.reduce(
    (acc, entry) => {
      const summary = (acc[entry.task.id] = acc[entry.task.id] || {});
      summary[entry.user.name] = (summary[entry.user.name] || 0) + entry.hours;
      return acc;
    },
    {} as { [key: number]: { [key: string]: number } },
  );
