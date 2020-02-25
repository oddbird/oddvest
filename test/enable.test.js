import flushPromises from 'flush-promises';

import { getEnableConfig, setEnableConfig } from '../src/lib/store';

jest.mock('../src/lib/store');

import enable from '../src/enable';

const makeElement = (tag, id) => {
  const el = document.createElement(tag);
  el.id = id;
  document.body.appendChild(el);

  return el;
};

describe('enable', () => {
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

    form = makeElement('form', 'enableForm');
    makeElement('input', 'clientId');
    makeElement('input', 'accountId');

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test('enable renders with values from getEnableConfig', async () => {
    getEnableConfig.mockImplementation(() => ({
      clientId: 'clientId',
      accountId: 'accountId',
    }));

    enable();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#enableForm');
  });

  test('enable renders with missing values from getEnableConfig', async () => {
    getEnableConfig.mockImplementation(() => ({}));

    enable();
    await flushPromises();

    expect(t.sizeTo).toHaveBeenCalledWith('#enableForm');
  });

  test('submit calls setEnableConfig', async () => {
    getEnableConfig.mockImplementation(() => ({}));
    enable();

    await submitHandler({ preventDefault: jest.fn() });

    expect(setEnableConfig).toHaveBeenCalledWith(t, {
      clientId: '',
      accountId: '',
    });
  });
});
