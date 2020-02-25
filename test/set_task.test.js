import flushPromises from 'flush-promises';

import { getTaskAssignments } from '../src/lib/harvest';
import { getProjectId, getTask, setTask } from '../src/lib/store';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

import set_task from '../src/set_task';

const makeElement = (tag, id, parent) => {
  const el = document.createElement(tag);
  el.id = id;
  (parent || document.body).appendChild(el);

  return el;
};

describe('set_task', () => {
  let t, form, option, submitHandler;

  beforeEach(() => {
    t = {
      render: (cb) => cb(),
      closePopup: jest.fn(),
      sizeTo: jest.fn(),
    };
    window.TrelloPowerUp = {
      iframe: () => t,
    };

    form = makeElement('form', 'setTaskForm');
    const select = makeElement('select', 'taskId');

    const defaultOption = makeElement('option', 'default', select);
    // defaultOption.value = '';
    defaultOption.text = '---';

    option = makeElement('option', 'opt1', select);
    option.value = '1';
    option.text = 'First';

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };

    getTask.mockImplementation(() => ({
      id: 1,
      name: 'First',
    }));
    getProjectId.mockImplementation(() => 1);
    getTaskAssignments.mockImplementation(() => [
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
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test.skip('set_task renders', async () => {
    set_task();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#setTaskForm');
  });

  test('submit calls setTask', async () => {
    option.selected = true;
    set_task();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setTask).toHaveBeenCalledWith(t, { id: 1, name: 'First' });
  });

  // TODO: this doesn't work.
  test.skip('submit calls setTask with null if nothing selected', async () => {
    delete option.selected;
    set_task();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setTask).toHaveBeenCalledWith(t, null);
  });
});
