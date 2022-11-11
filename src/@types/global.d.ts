import BluebirdPromise from 'bluebird';

interface TrelloSync {
  signUrl: (url: string, args?: { [key: string]: string }) => string;
}

interface TrelloAsync {
  [key: string]: (...args: any[]) => BluebirdPromise<any>;
}

declare global {
  type Trello = TrelloSync & TrelloAsync;

  const TrelloPowerUp: {
    initialize: (opts: { [key: string]: (t: Trello) => any }) => void;
    iframe: () => Trello;
    Promise: typeof BluebirdPromise;
  };
}
