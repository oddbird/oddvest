import fetchMock from 'fetch-mock';

import {
  API_BASE_URL,
  getHarvestData,
  getHarvestJSON,
  getTimeSummary,
  summarizeTimeEntries,
} from '../src/lib/harvest';
import trelloMock from './trello-mock.js';

describe('getHarvestJSON', () => {
  test('gets JSON data from Harvest via XHR', async () => {
    const url = `${API_BASE_URL}some/path`;
    fetchMock.getOnce(url, { some: 'data' });
    const data = await getHarvestJSON(trelloMock, url);

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

describe('getHarvestData', () => {
  test('gets deduped data from multiple pages, stopping when there are no more', async () => {
    const firstUrl = `${API_BASE_URL}some/path`;
    const secondUrl = `${firstUrl}?page=2`;
    fetchMock
      .getOnce(firstUrl, {
        things: [{ id: 1 }, { id: 2 }],
        links: { next: secondUrl },
      })
      .getOnce(secondUrl, {
        things: [{ id: 1 }, { id: 3 }],
        links: { next: null },
      });
    const data = await getHarvestData(trelloMock, 'some/path', 'things');

    expect(data).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});

describe('summarizeTimeEntries', () => {
  test('summarizes all given time entries', () => {
    const entries = [
      { task: { id: 1 }, user: { name: 'A' }, hours: 1.2 },
      { task: { id: 2 }, user: { name: 'A' }, hours: 2.4 },
      { task: { id: 2 }, user: { name: 'A' }, hours: 0.2 },
      { task: { id: 2 }, user: { name: 'B' }, hours: 0.7 },
    ];
    const summaries = summarizeTimeEntries(entries);

    expect(summaries).toEqual({ 1: { A: 1.2 }, 2: { A: 2.6, B: 0.7 } });
  });
});

describe('getTimeSummary', () => {
  test('gets time summary for a task', async () => {
    const projectId = 1;
    const taskId = 12;
    // eslint-disable-next-line max-len
    const firstUrl = `${API_BASE_URL}time_entries?is_running=false&project_id=${projectId}`;
    const secondUrl = `${firstUrl}&page=2`;
    fetchMock
      .getOnce(firstUrl, {
        time_entries: [
          { id: 1, task: { id: 12 }, user: { name: 'A' }, hours: 1.2 },
          { id: 2, task: { id: 13 }, user: { name: 'A' }, hours: 3.1 },
        ],
        links: { next: secondUrl },
      })
      .getOnce(secondUrl, {
        time_entries: [
          { id: 3, task: { id: 12 }, user: { name: 'B' }, hours: 0.5 },
        ],
        links: { next: null },
      });
    const summary = await getTimeSummary(trelloMock, projectId, taskId);
    expect(summary).toEqual({ A: 1.2, B: 0.5 });
  });
});
