import flushPromises from 'flush-promises';

import auth from '../src/auth';
import { setAuthToken } from '../src/lib/store';
import { makeElement, t } from './helpers';

jest.mock('../src/lib/store');

describe('auth', () => {
  let btn;

  beforeEach(() => {
    btn = makeElement('button', 'authorize');
  });

  test('sets auth token and closes popup', async () => {
    auth();
    btn.click();
    await flushPromises();

    expect(setAuthToken).toHaveBeenCalled();
    expect(t.closePopup).toHaveBeenCalled();
  });
});
