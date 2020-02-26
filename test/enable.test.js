import flushPromises from 'flush-promises';

import enable from '../src/enable';
import { getEnableConfig, setEnableConfig } from '../src/lib/store';
import { makeElement, t } from './helpers';

jest.mock('../src/lib/store');

describe('enable', () => {
  let form, clientId, accountId, submitHandler;

  beforeEach(() => {
    form = makeElement('form', 'enableForm');
    clientId = makeElement('input', 'clientId');
    accountId = makeElement('input', 'accountId');

    form.addEventListener = (name, cb) => {
      submitHandler = cb;
    };
  });

  test('renders with values from getEnableConfig', async () => {
    getEnableConfig.mockResolvedValue({
      clientId: 'client-id',
      accountId: 'account-id',
    });
    enable();
    await flushPromises();

    expect(clientId.value).toEqual('client-id');
    expect(accountId.value).toEqual('account-id');
    expect(t.sizeTo).toHaveBeenCalledWith('#enableForm');
  });

  test('renders with missing values from getEnableConfig', async () => {
    getEnableConfig.mockResolvedValue({});
    enable();
    await flushPromises();

    expect(clientId.value).toEqual('');
    expect(accountId.value).toEqual('');
    expect(t.sizeTo).toHaveBeenCalledWith('#enableForm');
  });

  test('submit calls setEnableConfig', async () => {
    getEnableConfig.mockResolvedValue({
      clientId: 'client-id',
      accountId: 'account-id',
    });
    enable();
    await flushPromises();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setEnableConfig).toHaveBeenCalledWith(t, {
      clientId: 'client-id',
      accountId: 'account-id',
    });
    expect(t.closePopup).toHaveBeenCalledTimes(1);
  });

  test('submit uses default values if missing', async () => {
    getEnableConfig.mockResolvedValue({});
    enable();
    await flushPromises();
    await submitHandler({ preventDefault: jest.fn() });

    expect(setEnableConfig).toHaveBeenCalledWith(t, {
      clientId: '',
      accountId: '',
    });
    expect(t.closePopup).toHaveBeenCalledTimes(1);
  });
});
