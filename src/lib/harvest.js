import { getAuthToken, getEnableConfig, TrelloPromise } from './store';

const API_BASE_URL = 'https://api.harvestapp.com/api/v2/';

export const getHarvestJSON = (t, path) =>
  new TrelloPromise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', reject);
    xhr.addEventListener('load', (event) => {
      resolve(JSON.parse(event.target.responseText));
    });
    xhr.open('GET', API_BASE_URL + path);
    TrelloPromise.all([getEnableConfig(t), getAuthToken(t)]).then((results) => {
      const accountId = results[0].accountId;
      const authToken = results[1];
      xhr.setRequestHeader('Harvest-Account-ID', accountId);
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
      // Harvest API docs say to send this, but they don't include it in
      // Access-Control-Allow-Headers so it's not possible to send it.
      // xhr.setRequestHeader('User-Agent', 'Oddvest (carl@oddbird.net)');
      xhr.send();
    });
  });
