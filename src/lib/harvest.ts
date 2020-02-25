/* eslint-disable @typescript-eslint/camelcase */

import 'whatwg-fetch';

import uniqBy from 'lodash.uniqby';

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

// Based on https://fetch.spec.whatwg.org/#fetch-api
export const addUrlParams = (
  baseUrl: string,
  params: { [key: string]: string | number | boolean } = {},
) => {
  const url = new URL(baseUrl, API_BASE_URL);
  Object.keys(params).forEach((key) => {
    const value = params[key].toString();
    // Disallow duplicate params with the same key:value
    if (url.searchParams.get(key) !== value) {
      url.searchParams.append(key, value);
    }
  });
  return url.href;
};

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
  params: { [key: string]: string | number | boolean },
  dataKey: 'task_assignments' | 'time_entries' | 'projects',
) => {
  const url = addUrlParams(path, params);
  const firstPage = await getHarvestJSON(t, url);
  const data: any[] = firstPage[dataKey] || [];
  if (firstPage.total_pages > 1) {
    const promises = [];
    for (let page = 2; page <= firstPage.total_pages; page = page + 1) {
      promises.push(getHarvestJSON(t, addUrlParams(path, { ...params, page })));
    }
    const remainingPages = await Promise.all(promises);
    remainingPages.forEach((pageResponse) => {
      const pageData = pageResponse[dataKey] || [];
      data.push(...pageData);
    });
  }
  // There is a race condition here due to the lack of persistent cursors for
  // paginating the Harvest API. If a new entry is added or removed from
  // Harvest while we are iterating pages, our pages will get off-by-one and
  // we will either skip or duplicate an entry.
  //
  // We handle new entries added (because generally things shouldn't be
  // deleted) by removing duplicate IDs (since all entries have unique IDs).
  //
  // If we would want to also handle deletion races, then we'd have to pay
  // attention to the `total_entries` key that comes with each response, and
  // if it changes while we are paging through, we'd need to go back and
  // re-fetch all pages that had the old `total_entries` count, looking for
  // any new ID in those pages that we didn't see before.
  return uniqBy(data, 'id') as TaskAssignment[] | TimeEntry[] | Project[];
};

export const getTaskAssignments = (
  t: Trello,
  projectId: number,
): Promise<TaskAssignment[]> =>
  getHarvestData(
    t,
    `projects/${projectId}/task_assignments`,
    { is_active: true },
    'task_assignments',
  ) as Promise<TaskAssignment[]>;

export const getTimeEntries = (
  t: Trello,
  projectId: number,
): Promise<TimeEntry[]> =>
  getHarvestData(
    t,
    'time_entries',
    { is_running: false, project_id: projectId },
    'time_entries',
  ) as Promise<TimeEntry[]>;

export const getProjects = (t: Trello): Promise<Project[]> =>
  getHarvestData(t, 'projects', { is_active: true }, 'projects') as Promise<
    Project[]
  >;

// summarize an array of TimeEntry to a task-id -> TimeSummary map
// where a TimeSummary is a dev-name -> total-hours map
export const summarizeTimeEntries = (entries: TimeEntry[]): TaskSummaries =>
  entries.reduce((acc, entry) => {
    const summary = (acc[entry.task.id] = acc[entry.task.id] || {});
    summary[entry.user.name] = (summary[entry.user.name] || 0) + entry.hours;
    return acc;
  }, {} as { [key: number]: { [key: string]: number } });

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
