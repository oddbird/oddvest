import { getAuthToken, getTask } from '../src/lib/store';

jest.mock('../src/lib/store');

import client from '../src/client';

describe('client', () => {
  let tpuObject, mockT;

  beforeAll(() => {
    window.TrelloPowerUp = {
      initialize: jest.fn().mockImplementation((obj) => {
        tpuObject = obj;
      }),
    };
    client();
  });

  beforeEach(() => {
    mockT = {
      popup: jest.fn(),
      signUrl: jest.fn().mockImplementation((url) => url),
    };
  });

  afterAll(() => {
    delete window.TrelloPowerUp;
  });

  test('on-enable calls t.popup', () => {
    tpuObject['on-enable'](mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Set up Oddvest',
      url: './enable.html',
      height: 184,
    });
  });

  test('show-settings calls t.popup', () => {
    tpuObject['show-settings'](mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Configure Oddvest',
      url: './settings.html',
      height: 184,
    });
  });

  test('card-buttons returns correct object', () => {
    const cardButtons = tpuObject['card-buttons']();
    expect(cardButtons.length).toEqual(1);
    expect(cardButtons[0].icon).toEqual(
      'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
    );
    expect(cardButtons[0].text).toEqual('Set Task');

    cardButtons[0].callback(mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Set Task',
      url: 'set_task.html',
    });
  });

  test('card-back-section returns correct object', () => {
    const cardBackSection = tpuObject['card-back-section'](mockT);

    expect(cardBackSection).toEqual({
      title: 'Harvest Time',
      icon:
        'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg',
      content: {
        type: 'iframe',
        url: './report.html',
        height: 230,
      },
    });
  });

  test('card-badges returns correct object with present task', async () => {
    const task = {
      name: 'test name',
    };
    getTask.mockImplementation(() => task);
    const cardBadges = await tpuObject['card-badges'](mockT);

    expect(cardBadges).toEqual([
      {
        icon:
          'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717',
        text: 'test name',
        color: null,
      },
    ]);
  });

  test('card-badges returns correct object with absent task', async () => {
    getTask.mockImplementation(() => null);
    const cardBadges = await tpuObject['card-badges'](mockT);

    expect(cardBadges).toEqual([
      {
        icon:
          'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717',
        text: 'no task!',
        color: 'red',
      },
    ]);
  });

  test('card-detail-badges returns correct object with present task', async () => {
    const task = {
      name: 'test name',
    };
    getTask.mockImplementation(() => task);
    const cardDetailBadges = await tpuObject['card-detail-badges'](mockT);

    expect(cardDetailBadges.length).toEqual(1);
    expect(cardDetailBadges[0].title).toEqual('Task');
    expect(cardDetailBadges[0].text).toEqual('test name');
    expect(cardDetailBadges[0].color).toBeNull();

    cardDetailBadges[0].callback(mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Set Task',
      url: 'set_task.html',
    });
  });

  test('card-detail-badges returns correct object with absent task', async () => {
    getTask.mockImplementation(() => null);
    const cardDetailBadges = await tpuObject['card-detail-badges'](mockT);

    expect(cardDetailBadges.length).toEqual(1);
    expect(cardDetailBadges[0].title).toEqual('Task');
    expect(cardDetailBadges[0].text).toEqual('no task!');
    expect(cardDetailBadges[0].color).toEqual('red');

    cardDetailBadges[0].callback(mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Set Task',
      url: 'set_task.html',
    });
  });

  test('authorization-status returns correct object', async () => {
    getAuthToken.mockImplementation(() => null);
    const authorizationStatus = await tpuObject['authorization-status'](mockT);
    expect(authorizationStatus).toEqual({ authorized: false });
  });

  test('show-authorization calls t.popup', () => {
    tpuObject['show-authorization'](mockT);
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Authorize Harvest Account',
      url: './auth.html',
      height: 140,
    });
  });
});
