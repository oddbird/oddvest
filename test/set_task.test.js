import flushPromises from 'flush-promises';

import { getTaskAssignments } from '../src/lib/harvest';
import { getProjectId, getTask, setTask } from '../src/lib/store';
import set_task from '../src/set_task';
import { makeElement, t } from './helpers';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

getTask.mockResolvedValue({
  id: 1,
  name: 'First',
});
getProjectId.mockResolvedValue(1);
getTaskAssignments.mockResolvedValue([
  {
    task: {
      id: 1,
      name: 'First',
    },
  },
  {
    task: {
      id: 2,
      name: 'Second',
    },
  },
]);

describe('set_task', () => {
  let form, select, option, submitHandler;

  beforeEach(() => {
    form = makeElement('form', 'setTaskForm');
    select = makeElement('select', 'taskId');

    const defaultOption = makeElement('option', 'default', select);
    defaultOption.value = '';
    defaultOption.text = '--clear--';

    option = makeElement('option', 'opt1', select);
    option.value = '1';
    option.text = 'First';

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };
  });

  test('renders select', async () => {
    set_task();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#setTaskForm');
    expect(select.value).toEqual('1');
  });

  test('submit calls setTask', async () => {
    set_task();
    await flushPromises();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setTask).toHaveBeenCalledWith(t, { id: 1, name: 'First' });
    expect(t.closePopup).toHaveBeenCalledTimes(1);
  });

  test('submit calls setTask with null if nothing selected', async () => {
    set_task();
    await flushPromises();
    select.value = '';
    await submitHandler({ preventDefault: jest.fn() });

    expect(setTask).toHaveBeenCalledWith(t, null);
  });
});
