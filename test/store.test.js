import { getAuthToken, setAuthToken, setEnableConfig } from '../src/lib/store';
import trelloMock from './trello-mock.js';

describe('setEnableConfig', () => {
  test('sets config on Trello', () => {
    setEnableConfig(trelloMock, {
      clientId: 'clientId',
      accountId: 'accountId',
    });

    expect(trelloMock.set).toHaveBeenCalledWith('board', 'shared', {
      harvestClientId: 'clientId',
      harvestAccountId: 'accountId',
    });
  });
});

describe('setAuthToken', () => {
  test('stores secret', () => {
    setAuthToken(trelloMock, 'secret token');

    expect(trelloMock.storeSecret).toHaveBeenCalledWith(
      'harvestAuthToken',
      'secret token',
    );
  });
});

describe('getAuthToken', () => {
  test('returns null on an error', async () => {
    // TODO: how do we suppress console logging in our tests?
    const localTrelloMock = {
      loadSecret: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    };
    expect(await getAuthToken(localTrelloMock)).toEqual(null);
  });
});
