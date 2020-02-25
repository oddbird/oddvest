import flushPromises from 'flush-promises';

import { getProjects } from '../src/lib/harvest';
import { getProjectId, setProjectId } from '../src/lib/store';

jest.mock('../src/lib/harvest');
jest.mock('../src/lib/store');

import settings from '../src/settings';

const makeElement = (tag, id) => {
  const el = document.createElement(tag);
  el.id = id;
  document.body.appendChild(el);

  return el;
};

describe('settings', () => {
  let t, form, submitHandler;

  beforeAll(() => {
    t = {
      render: (cb) => cb(),
      closePopup: jest.fn(),
      sizeTo: jest.fn(),
    };
    window.TrelloPowerUp = {
      iframe: () => t,
    };

    form = makeElement('form', 'settingsForm');
    makeElement('select', 'projectId');

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };

    getProjects.mockImplementation(() => [
      {
        id: 1,
        name: 'First',
      },
      {
        id: 2,
        name: 'Second',
      },
    ]);
    getProjectId.mockImplementation(() => 1);
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test.skip('settings renders', async () => {
    settings();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#settingsForm');
  });

  test('submit calls setProjectId', async () => {
    settings();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setProjectId).toHaveBeenCalledWith(t, '');
  });
});
