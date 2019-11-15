import 'whatwg-fetch';

import { getAuthToken, getEnableConfig } from './store';
import {
  HarvestAPIResponse,
  Project,
  TaskAssignment,
  TaskSummaries,
  TimeEntry,
  TimeSummary,
} from './types';

export const API_BASE_URL = 'https://api.harvestapp.com/v2/';

// get a single request (one page) JSON response from Harvest API
export const getHarvestJSON = async (
  t: Trello,
  url: string,
): Promise<HarvestAPIResponse> => {
  const [{ accountId }, authToken] = await Promise.all([
    getEnableConfig(t),
    getAuthToken(t),
  ]);
  const response = await fetch(url, {
    headers: {
      'Harvest-Account-ID': accountId,
      Authorization: `Bearer ${authToken}`,
      'User-Agent': 'Oddvest (carl@oddbird.net)',
    },
  });
  return response.json();
};

// get all available data (all pages) from a given Harvest API path
export const getHarvestData = async (
  t: Trello,
  path: string,
  dataKey: 'task_assignments' | 'time_entries' | 'projects',
) => {
  let url: string | null = API_BASE_URL + path;
  const data = [];
  while (url) {
    // I think we could make this more efficient by getting the total number of
    // pages on the first request, and then firing off concurrent requests for
    // all remaining pages. But just iterating pages is simpler to start with.
    //
    // eslint-disable-next-line no-await-in-loop
    const page: HarvestAPIResponse = await getHarvestJSON(t, url);
    const pageData = page[dataKey];

    // @@@ There is a race condition here due to the lack of persistent cursors
    // for paginating the Harvest API. If a new entry is added or removed from
    // Harvest while we are iterating pages, our pages will get off-by-one and
    // we will either skip or duplicate an entry. If we are only concerned about
    // new entries added (because generally things shouldn't be deleted), and if
    // all entries have unique IDs (I think they do), we can just dedupe by ID.
    // If we want to also handle deletion races, then we have to pay attention
    // to the `total_entries` key that comes with each response, and if it
    // changes while we are paging through, we need to go back and re-fetch all
    // pages that had the old `total_entries` count, looking for any new ID in
    // those pages that we didn't see before.
    if (pageData) {
      data.push(...pageData);
    }
    url = page.links.next;
  }
  return data;
};

export const getTaskAssignments = (
  t: Trello,
  projectId: number,
): Promise<TaskAssignment[]> =>
  getHarvestData(
    t,
    `projects/${projectId}/task_assignments?is_active=true`,
    'task_assignments',
  ) as Promise<TaskAssignment[]>;

export const getTimeEntries = (
  t: Trello,
  projectId: number,
): Promise<TimeEntry[]> =>
  getHarvestData(
    t,
    `time_entries?is_running=false&project_id=${projectId}`,
    'time_entries',
  ) as Promise<TimeEntry[]>;

export const getProjects = (t: Trello): Promise<Project[]> =>
  getHarvestData(t, 'projects?is_active=true', 'projects') as Promise<
    Project[]
  >;

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

// get TimeSummary for a given task
export const getTimeSummary = async (
  t: Trello,
  projectId: number,
  taskId: number,
): Promise<TimeSummary> => {
  const timeEntries = await getTimeEntries(t, projectId);
  const summary = summarizeTimeEntries(timeEntries);
  return summary[taskId] || {};
};
