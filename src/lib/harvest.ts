import 'whatwg-fetch';

import { getAuthToken, getEnableConfig } from './store';
import { Project, TaskAssignment, TimeEntry } from './types';

export const API_BASE_URL = 'https://api.harvestapp.com/v2/';

const getHarvestJSONFromUrl = async (t: Trello, url: string) => {
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

export const getHarvestJSON = (t: Trello, path: string) =>
  getHarvestJSONFromUrl(t, API_BASE_URL + path);

export const getHarvestJSONAll = async (
  t: Trello,
  path: string,
  dataKey: string,
) => {
  let url = API_BASE_URL + path;
  const data = [];
  while (url) {
    // I think we could make this more efficient by getting the total number of
    // pages on the first request, and then firing off concurrent requests for
    // all remaining pages. But just iterating pages is simpler to start with.
    //
    // eslint-disable-next-line no-await-in-loop
    const page = await getHarvestJSONFromUrl(t, url);

    // There is a race condition here due to the lack of persistent cursors for
    // paginating the Harvest API. If a new entry is added or removed from
    // Harvest while we are iterating pages, our pages will get off-by-one and
    // we will either skip or duplicate an entry. If we are only concerned
    // about new entries added (because generally things shouldn't be deleted),
    // and if all entries have unique IDs (I think they do), we can just dedupe
    // by ID. If we want to also handle deletion races, then we have to pay
    // attention to the `total_entries` key that comes with each response, and
    // if it changes while we are paging through, we need to go back and
    // re-fetch all pages that had the old `total_entries` count, looking for
    // any new ID in those pages that we didn't see before.
    data.push(...page[dataKey]);
    url = page.links.next;
  }
  return data;
};

export const getTaskAssignments = (
  t: Trello,
  projectId: number,
): Promise<TaskAssignment[]> =>
  getHarvestJSONAll(
    t,
    `projects/${projectId}/task_assignments?is_active=true`,
    'task_assignments',
  );

export const getTimeEntries = (
  t: Trello,
  projectId: number,
): Promise<TimeEntry[]> =>
  getHarvestJSONAll(t, `time_entries?project_id=${projectId}`, 'time_entries');

export const getProjects = (t: Trello): Promise<Project[]> =>
  getHarvestJSONAll(t, 'projects?is_active=true', 'projects');
