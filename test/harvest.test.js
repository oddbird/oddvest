import fetchMock from 'fetch-mock';

import * as h from '../src/lib/harvest';
import { t } from './trello-mock.js';

describe('addUrlParams', () => {
  test('has default args', () => {
    const results = h.addUrlParams('https://example.com');

    expect(results).toEqual('https://example.com/');
  });

  test('disallows duplicate keys', () => {
    const results = h.addUrlParams(
      'https://example.com/?key=value&another=thing',
      { key: 'value', another: 'val' },
    );

    expect(results).toEqual(
      'https://example.com/?key=value&another=thing&another=val',
    );
  });
});

describe('getHarvestJSON', () => {
  test('gets JSON data from Harvest via XHR', async () => {
    const url = `${h.API_BASE_URL}some/path`;
    fetchMock.getOnce(url, { some: 'data' });
    const data = await h.getHarvestJSON(t, url);

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
    const firstUrl = `${h.API_BASE_URL}some/path`;
    const secondUrl = `${firstUrl}?page=2`;
    fetchMock
      .getOnce(firstUrl, {
        things: [{ id: 1 }, { id: 2 }],
        total_pages: 2,
      })
      .getOnce(secondUrl, {
        things: [{ id: 1 }, { id: 3 }],
        total_pages: 2,
      });
    const data = await h.getHarvestData(t, 'some/path', {}, 'things');

    expect(data).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test('handles malformed pageResponse data', async () => {
    const firstUrl = `${h.API_BASE_URL}some/path`;
    const secondUrl = `${firstUrl}?page=2`;
    fetchMock
      .getOnce(firstUrl, {
        total_pages: 2,
      })
      .getOnce(secondUrl, {
        total_pages: 2,
      });
    const data = await h.getHarvestData(t, 'some/path', {}, 'things');

    expect(data).toEqual([]);
  });
});

describe('getTaskAssignments', () => {
  test('returns data', async () => {
    const data = await h.getTaskAssignments(t, 1);

    expect(data).toEqual([]);
  });
});

describe('getTimeEntries', () => {
  test('returns data', async () => {
    const data = await h.getTimeEntries(t, 1);

    expect(data).toEqual([]);
  });
});

describe('getProjects', () => {
  test('returns data', async () => {
    const data = await h.getProjects(t);

    expect(data).toEqual([]);
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
    const summaries = h.summarizeTimeEntries(entries);

    expect(summaries).toEqual({ 1: { A: 1.2 }, 2: { A: 2.6, B: 0.7 } });
  });
});

describe('getTimeSummary', () => {
  test('gets time summary for a task', async () => {
    const projectId = 1;
    const taskId = 12;
    // eslint-disable-next-line max-len
    const firstUrl = `${h.API_BASE_URL}time_entries?is_running=false&project_id=${projectId}`;
    const secondUrl = `${firstUrl}&page=2`;
    fetchMock
      .getOnce(firstUrl, {
        time_entries: [
          { id: 1, task: { id: 12 }, user: { name: 'A' }, hours: 1.2 },
          { id: 2, task: { id: 13 }, user: { name: 'A' }, hours: 3.1 },
        ],
        total_pages: 2,
      })
      .getOnce(secondUrl, {
        time_entries: [
          { id: 3, task: { id: 12 }, user: { name: 'B' }, hours: 0.5 },
        ],
        total_pages: 2,
      });
    const summary = await h.getTimeSummary(t, projectId, taskId);
    expect(summary).toEqual({ A: 1.2, B: 0.5 });
  });

  test('defaults to an empty object', async () => {
    const projectId = 1;
    const taskId = 16;
    const summary = await h.getTimeSummary(t, projectId, taskId);

    expect(summary).toEqual({});
  });
});
