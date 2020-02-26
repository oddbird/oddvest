import fetchMock from 'fetch-mock';

import { TrelloPowerUp } from './helpers';

beforeAll(() => {
  window.TrelloPowerUp = TrelloPowerUp;
});

afterEach(() => {
  fetchMock.reset();
  document.body.innerHTML = '';
});
