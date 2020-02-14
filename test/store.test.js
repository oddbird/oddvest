import {
  getAuthToken,
  getProjectId,
  getTask,
  setAuthToken,
  setEnableConfig,
  setProjectId,
  setTask,
} from '../src/lib/store';
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
  let originalError;

  beforeAll(() => {
    originalError = console.error;

    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('returns null on an error', async () => {
    const localTrelloMock = {
      loadSecret: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    };
    expect(await getAuthToken(localTrelloMock)).toEqual(null);
  });
});

describe('setProjectId', () => {
  test('sets config on Trello', () => {
    setProjectId(trelloMock, 'someId');

    expect(trelloMock.set).toHaveBeenCalledWith(
      'board',
      'shared',
      'harvestProjectId',
      'someId',
    );
  });
});

describe('getProjectId', () => {
  test('returns the projectIdStr', async () => {
    const localTrelloMock = {
      get: jest.fn().mockImplementation(() => '1'),
    };
    const actual = await getProjectId(localTrelloMock);

    expect(actual).toEqual(1);
  });
});

describe('setTask', () => {
  test('calls set on Trello', () => {
    setTask(trelloMock, { id: 1, name: 'test' });

    expect(trelloMock.set).toHaveBeenCalledWith(
      'card',
      'shared',
      'harvestTask',
      '{"id":1,"name":"test"}',
    );
  });
});

describe('getTask', () => {
  test('calls set on Trello', async () => {
    const localTrelloMock = {
      get: jest.fn().mockImplementation(() => '{"id":1,"name":"test"}'),
    };
    const actual = await getTask(localTrelloMock);

    expect(actual).toEqual({ id: 1, name: 'test' });
  });

  test('defaults to null', async () => {
    const localTrelloMock = {
      get: jest.fn().mockImplementation(() => ''),
    };
    const actual = await getTask(localTrelloMock);

    expect(actual).toEqual(null);
  });
});
