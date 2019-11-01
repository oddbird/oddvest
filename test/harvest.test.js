import fetchMock from 'fetch-mock';

import { API_BASE_URL, getHarvestJSON } from '../src/lib/harvest';

describe('harvest', () => {
  test('gets JSON data from Harvest via XHR', async () => {
    const trello = {
      get: (scope, visibility, key) => `${scope + visibility + key}TestValue`,
      loadSecret: (key) => `${key}TestSecret`,
    };
    const url = `${API_BASE_URL}some/path`;
    fetchMock.getOnce(url, { some: 'data' });
    const data = await getHarvestJSON(trello, 'some/path');

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
