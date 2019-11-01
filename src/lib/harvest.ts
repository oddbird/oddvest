import 'whatwg-fetch';

import { getAuthToken, getEnableConfig, TrelloPromise } from './store';

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
