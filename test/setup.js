import fetchMock from 'fetch-mock';

import { TrelloPowerUp } from './trello-mock.js';

beforeAll(() => {
  window.TrelloPowerUp = TrelloPowerUp;
});

afterEach(fetchMock.reset);
