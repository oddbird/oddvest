import fetchMock from 'fetch-mock';

import { API_BASE_URL, getHarvestJSON } from '../src/lib/harvest';
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
