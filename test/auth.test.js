import flushPromises from 'flush-promises';

import auth from '../src/auth';
import { setAuthToken } from '../src/lib/store';
import { t } from './trello-mock.js';

jest.mock('../src/lib/store');

describe('auth', () => {
  let btn;

  beforeAll(() => {
    btn = document.createElement('button');
    btn.id = 'authorize';
    document.body.appendChild(btn);
  });

  test('sets auth token and closes popup', async () => {
    auth();
    btn.click();
    // We have to wait for the async click handler to finish entirely:
    await flushPromises();

    expect(setAuthToken).toHaveBeenCalled();
    expect(t.closePopup).toHaveBeenCalled();
  });
});
