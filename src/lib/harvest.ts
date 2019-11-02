import 'whatwg-fetch';

import BluebirdPromise from 'bluebird';

import { getAuthToken, getEnableConfig, TrelloPromise } from './store';
import { ProjectsData, TaskAssignmentsData, TimeEntriesData } from './types';

export const API_BASE_URL = 'https://api.harvestapp.com/v2/';

export const getHarvestJSON = (t: Trello, path: string) =>
  TrelloPromise.all([getEnableConfig(t), getAuthToken(t)]).then(
    ([{ accountId }, authToken]) =>
      fetch(API_BASE_URL + path, {
        headers: {
          'Harvest-Account-ID': accountId,
          Authorization: `Bearer ${authToken}`,
          'User-Agent': 'Oddvest (carl@oddbird.net)',
        },
      }).then((response) => response.json()),
  );

// @@@ TODO if we ever assign more than 100 tasks to a single project,
// this will break due to API pagination. So let's not do that, m'kay.
export const getTaskAssignments = (
  t: Trello,
  projectId: number,
): BluebirdPromise<TaskAssignmentsData> =>
  getHarvestJSON(t, `projects/${projectId}/task_assignments?is_active=true`);

export const getTimeEntries = (
  t: Trello,
  projectId: number,
): BluebirdPromise<TimeEntriesData> =>
  getHarvestJSON(t, `time_entries?project_id=${projectId}`);

export const getProjects = (t: Trello): BluebirdPromise<ProjectsData> =>
  getHarvestJSON(t, 'projects?is_active=true');
