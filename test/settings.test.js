import flushPromises from 'flush-promises';

import { getProjects } from '../src/lib/harvest';
import { getProjectId, setProjectId } from '../src/lib/store';
import settings from '../src/settings';
import { makeElement, t } from './helpers';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

getProjects.mockResolvedValue([
  {
    id: 1,
    name: 'First',
  },
  {
    id: 2,
    name: 'Second',
  },
]);
getProjectId.mockResolvedValue(1);

describe('settings', () => {
  let form, select, submitHandler;

  beforeEach(() => {
    form = makeElement('form', 'settingsForm');
    select = makeElement('select', 'projectId');

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };
  });

  test('renders', async () => {
    settings();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#settingsForm');
    expect(select.value).toEqual('1');
  });

  test('submit calls setProjectId', async () => {
    settings();
    await flushPromises();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setProjectId).toHaveBeenCalledWith(t, '1');
    expect(t.closePopup).toHaveBeenCalledTimes(1);
  });

  test('submit calls setProjectId with empty string if none selected', async () => {
    settings();
    await flushPromises();
    select.innerHTML = '';
    await submitHandler({ preventDefault: jest.fn() });

    expect(setProjectId).toHaveBeenCalledWith(t, '');
    expect(t.closePopup).toHaveBeenCalledTimes(1);
  });
});
