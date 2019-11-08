import fetchMock from 'fetch-mock';

import {
  API_BASE_URL,
  getHarvestJSON,
  getHarvestJSONAll,
} from '../src/lib/harvest';
import trelloMock from './trello-mock.js';

describe('getHarvestJSON', () => {
  test('gets JSON data from Harvest via XHR', async () => {
    const url = `${API_BASE_URL}some/path`;
    fetchMock.getOnce(url, { some: 'data' });
    const data = await getHarvestJSON(trelloMock, 'some/path');

    expect(data).toEqual({ some: 'data' });
    expect(
      fetchMock.called(url, {
        headers: {
          'Harvest-Account-ID': 'boardsharedharvestAccountIdTestValue',
          Authorization: 'Bearer harvestAuthTokenTestSecret',
        },
      }),
    ).toBe(true);
  });
});

describe('getHarvestJSONAll', () => {
  test('gets data from multiple pages, stopping when there are no more', async () => {
    const firstUrl = `${API_BASE_URL}some/path`;
    const secondUrl = `${firstUrl}?page=2`;
    fetchMock
      .getOnce(firstUrl, { things: ['one', 'two'], links: { next: secondUrl } })
      .getOnce(secondUrl, { things: ['three'], links: { next: null } });
    const data = await getHarvestJSONAll(trelloMock, 'some/path', 'things');
    expect(data).toEqual(['one', 'two', 'three']);
  });
});
