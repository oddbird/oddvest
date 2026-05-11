require('isomorphic-fetch');
const { ReadableStream } = require('node:stream/web');
if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream;
}

import { TrelloPowerUp } from './helpers';

beforeAll(() => {
  window.TrelloPowerUp = TrelloPowerUp;
});

afterEach(() => {
  document.body.innerHTML = '';
});
