import client from '../src/client';
import { getAuthToken, getTask } from '../src/lib/store';
import { t, TrelloPowerUp } from './trello-mock';

jest.mock('../src/lib/store');

describe('client', () => {
  let opts;

  beforeEach(() => {
    client();
    opts = TrelloPowerUp.initialize.mock.calls[0][0];
  });

  test('on-enable calls t.popup', () => {
    opts['on-enable'](t);

    expect(t.popup).toHaveBeenCalledTimes(1);
  });

  test('show-settings calls t.popup', () => {
    opts['show-settings'](t);

    expect(t.popup).toHaveBeenCalledTimes(1);
  });

  test('card-buttons returns correct object', () => {
    const cardButtons = opts['card-buttons']();

    expect(cardButtons).toHaveLength(1);
    expect(cardButtons[0].text).toEqual('Set Task');

    cardButtons[0].callback(t);
    expect(t.popup).toHaveBeenCalledTimes(1);
  });

  test('card-back-section returns correct object', () => {
    const cardBackSection = opts['card-back-section'](t);

    expect(cardBackSection.title).toEqual('Harvest Time');
  });

  describe('card-badges', () => {
    test('returns correct object with present task', async () => {
      const task = {
        name: 'task name',
      };
      getTask.mockResolvedValue(task);
      const cardBadges = await opts['card-badges'](t);

      expect(cardBadges).toHaveLength(1);
      expect(cardBadges[0].text).toEqual(task.name);
      expect(cardBadges[0].color).toBeNull();
    });

    test('returns correct object with absent task', async () => {
      getTask.mockResolvedValue();
      const cardBadges = await opts['card-badges'](t);

      expect(cardBadges).toHaveLength(1);
      expect(cardBadges[0].text).toEqual('no task!');
      expect(cardBadges[0].color).toEqual('red');
    });
  });

  describe('card-detail-badges', () => {
    test('returns correct object with present task', async () => {
      const task = {
        name: 'task name',
      };
      getTask.mockResolvedValue(task);
      const cardDetailBadges = await opts['card-detail-badges'](t);

      expect(cardDetailBadges).toHaveLength(1);
      expect(cardDetailBadges[0].title).toEqual('Task');
      expect(cardDetailBadges[0].text).toEqual('task name');
      expect(cardDetailBadges[0].color).toBeNull();

      cardDetailBadges[0].callback(t);

      expect(t.popup).toHaveBeenCalledTimes(1);
    });

    test('returns correct object with absent task', async () => {
      getTask.mockResolvedValue();
      const cardDetailBadges = await opts['card-detail-badges'](t);

      expect(cardDetailBadges).toHaveLength(1);
      expect(cardDetailBadges[0].title).toEqual('Task');
      expect(cardDetailBadges[0].text).toEqual('no task!');
      expect(cardDetailBadges[0].color).toEqual('red');

      cardDetailBadges[0].callback(t);

      expect(t.popup).toHaveBeenCalledTimes(1);
    });
  });

  test('authorization-status returns correct object', async () => {
    getAuthToken.mockResolvedValue(null);
    const authorizationStatus = await opts['authorization-status'](t);

    expect(authorizationStatus).toEqual({ authorized: false });
  });

  test('show-authorization calls t.popup', () => {
    opts['show-authorization'](t);

    expect(t.popup).toHaveBeenCalledTimes(1);
  });
});
