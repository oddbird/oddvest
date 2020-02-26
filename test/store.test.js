/* eslint-disable no-console */
import {
  getAuthToken,
  getEnableConfig,
  getProjectId,
  getTask,
  setAuthToken,
  setEnableConfig,
  setProjectId,
  setTask,
} from '../src/lib/store';
import { t } from './helpers';

describe('setEnableConfig', () => {
  test('sets config on Trello', () => {
    setEnableConfig(t, {
      clientId: 'client-id',
      accountId: 'account-id',
    });

    expect(t.set).toHaveBeenCalledWith('board', 'shared', {
      harvestClientId: 'client-id',
      harvestAccountId: 'account-id',
    });
  });
});

describe('getEnableConfig', () => {
  test('gets config from Trello', async () => {
    const result = await getEnableConfig(t, {
      clientId: 'client-id',
      accountId: 'account-id',
    });

    expect(result).toEqual({
      clientId: 'boardsharedharvestClientIdTestValue',
      accountId: 'boardsharedharvestAccountIdTestValue',
    });
  });
});

describe('setAuthToken', () => {
  test('stores secret token', () => {
    setAuthToken(t, 'secret token');

    expect(t.storeSecret).toHaveBeenCalledWith(
      'harvestAuthToken',
      'secret token',
    );
  });
});

describe('getAuthToken', () => {
  let originalError;

  beforeAll(() => {
    originalError = console.error;

    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('gets secret token', async () => {
    const result = await getAuthToken(t);

    expect(result).toEqual('harvestAuthTokenTestSecret');
  });

  test('returns null on an error', async () => {
    const err = new Error('nope');
    const localTrelloMock = {
      loadSecret: jest.fn().mockImplementation(() => {
        throw err;
      }),
    };
    const result = await getAuthToken(localTrelloMock);

    expect(console.error).toHaveBeenCalledWith(err);
    expect(result).toEqual(null);
  });
});

describe('setProjectId', () => {
  test('sets config on Trello', () => {
    setProjectId(t, 'someId');

    expect(t.set).toHaveBeenCalledWith(
      'board',
      'shared',
      'harvestProjectId',
      'someId',
    );
  });
});

describe('getProjectId', () => {
  test('returns the projectId', async () => {
    const localTrelloMock = {
      get: jest.fn().mockResolvedValue('1'),
    };
    const actual = await getProjectId(localTrelloMock);

    expect(actual).toEqual(1);
  });
});

describe('setTask', () => {
  test('calls set on Trello', () => {
    setTask(t, { id: 1, name: 'test' });

    expect(t.set).toHaveBeenCalledWith(
      'card',
      'shared',
      'harvestTask',
      '{"id":1,"name":"test"}',
    );
  });
});

describe('getTask', () => {
  test('gets task from Trello', async () => {
    const localTrelloMock = {
      get: jest.fn().mockResolvedValue('{"id":1,"name":"test"}'),
    };
    const actual = await getTask(localTrelloMock);

    expect(actual).toEqual({ id: 1, name: 'test' });
  });

  test('defaults to null', async () => {
    const localTrelloMock = {
      get: jest.fn().mockResolvedValue(''),
    };
    const actual = await getTask(localTrelloMock);

    expect(actual).toEqual(null);
  });
});
