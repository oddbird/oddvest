import flushPromises from 'flush-promises';

import { getTaskAssignments, getTimeSummary } from '../src/lib/harvest';
import { getProjectId, getTask } from '../src/lib/store';
import report from '../src/report';
import { makeElement, t } from './helpers';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

describe('report', () => {
  let taskName, container;

  beforeEach(() => {
    getProjectId.mockResolvedValue(1);
    getTask.mockResolvedValue({
      id: 1,
      name: 'First',
    });
    getTimeSummary.mockResolvedValue({});
    getTaskAssignments.mockResolvedValue([]);
    taskName = makeElement('div', 'harvestTaskName');
    container = makeElement('form', 'reportContainer');
  });

  test('renders', async () => {
    report();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
    expect(taskName.innerHTML).toEqual('First');
    expect(container.innerHTML).toContain('Total');
  });

  test('renders and exits early if no task', async () => {
    getTask.mockResolvedValue(null);
    report();
    await flushPromises();

    expect(container.innerHTML).toEqual('');
    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
  });

  test('renders with hours by dev', async () => {
    getTimeSummary.mockResolvedValue({ 'Dev Name': 1.23, 'Other Dev': 2.12 });
    getTaskAssignments.mockResolvedValue([{ task: { id: 1 }, budget: 10 }]);
    report();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#allContainer');
    expect(container.innerHTML).toContain('Budgeted: 10 hours.');
    expect(container.innerHTML).toContain('Dev Name');
    expect(container.innerHTML).toContain('Other Dev');
    expect(container.innerHTML).toContain('1.2');
    expect(container.innerHTML).toContain('2.1');
    expect(container.innerHTML).toContain('3.4');
  });
});
