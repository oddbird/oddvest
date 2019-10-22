import { getAuthToken, getEnableConfig, TrelloPromise } from './store';

const API_BASE_URL = 'https://api.harvestapp.com/api/v2/';

export const getHarvestJSON = (t: Trello, path: string) =>
  new TrelloPromise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', reject);
    xhr.addEventListener('load', function cb() {
      try {
        resolve(JSON.parse(this.responseText));
      } catch (error) {
        reject(error);
      }
    });
    xhr.open('GET', API_BASE_URL + path);
    TrelloPromise.all([getEnableConfig(t), getAuthToken(t)]).then(
      ([{ accountId }, authToken]) => {
        xhr.setRequestHeader('Harvest-Account-ID', accountId);
        xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        // Harvest API docs say to send this, but they don't include it in
        // Access-Control-Allow-Headers so it's not possible to send it.
        // xhr.setRequestHeader('User-Agent', 'Oddvest (carl@oddbird.net)');
        xhr.send();
      },
    );
  });
