import { TrelloPowerUp } from './helpers';

beforeAll(() => {
  window.TrelloPowerUp = TrelloPowerUp;
});

afterEach(() => {
  document.body.innerHTML = '';
});
