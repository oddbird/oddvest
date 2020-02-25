import flushPromises from 'flush-promises';

import { getTaskAssignments, getTimeSummary } from '../src/lib/harvest';
import { getProjectId, getTask } from '../src/lib/store';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

import report from '../src/report';

const makeElement = (tag, id) => {
  const el = document.createElement(tag);
  el.id = id;
  document.body.appendChild(el);

  return el;
};

describe('report', () => {
  let t;

  beforeEach(() => {
    t = {
      render: (cb) => cb(),
      closePopup: jest.fn(),
      sizeTo: jest.fn(),
    };
    window.TrelloPowerUp = {
      iframe: () => t,
    };

    makeElement('div', 'harvestTaskName');
    makeElement('form', 'reportContainer');
    makeElement('select', 'projectId');
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test('report renders', async () => {
    getProjectId.mockImplementation(() => 1);
    getTask.mockImplementation(() => ({
      id: 1,
      name: 'First',
    }));
    getTimeSummary.mockImplementation(() => ({}));
    getTaskAssignments.mockImplementation(() => []);

    report();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
  });

  test('report renders and exits early if no task', async () => {
    getProjectId.mockImplementation(() => 1);
    getTask.mockImplementation(() => null);
    getTimeSummary.mockImplementation(() => ({}));
    getTaskAssignments.mockImplementation(() => []);

    report();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
  });

  test('report renders with hours by dev', async () => {
    getProjectId.mockImplementation(() => 1);
    getTask.mockImplementation(() => ({
      id: 1,
      name: 'First',
    }));
    getTimeSummary.mockImplementation(() => ({ 'Dev Name': 1.23 }));
    getTaskAssignments.mockImplementation(() => [
      { task: { id: 1 }, budget: 10 },
    ]);

    report();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
  });
});
