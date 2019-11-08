import 'whatwg-fetch';

import BluebirdPromise from 'bluebird';

import { getAuthToken, getEnableConfig, TrelloPromise } from './store';
import { Project, TaskAssignment, TimeEntriesResponse } from './types';

export const API_BASE_URL = 'https://api.harvestapp.com/v2/';

const getHarvestJSONFromUrl = (t: Trello, url: string) =>
  TrelloPromise.all([getEnableConfig(t), getAuthToken(t)]).then(
    ([{ accountId }, authToken]) =>
      fetch(url, {
        headers: {
          'Harvest-Account-ID': accountId,
          Authorization: `Bearer ${authToken}`,
          'User-Agent': 'Oddvest (carl@oddbird.net)',
        },
      }).then((response) => response.json()),
  );

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
): BluebirdPromise<TimeEntriesResponse> =>
  getHarvestJSON(t, `time_entries?project_id=${projectId}`);

export const getProjects = (t: Trello): Promise<Project[]> =>
  getHarvestJSONAll(t, 'projects?is_active=true', 'projects');
