import BluebirdPromise from 'bluebird';
import fetchMock from 'fetch-mock';

window.TrelloPowerUp = { Promise: BluebirdPromise };

afterEach(fetchMock.reset);
