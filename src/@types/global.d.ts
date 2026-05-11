import type BluebirdPromise from 'bluebird';

interface TrelloSync {
  signUrl: (url: string, args?: Record<string, string>) => string;
}

type TrelloAsync = Record<string, (...args: any[]) => BluebirdPromise<any>>;

declare global {
  type Trello = TrelloSync & TrelloAsync;

  const TrelloPowerUp: {
    initialize: (opts: Record<string, (t: Trello) => any>) => void;
    iframe: () => Trello;
    Promise: typeof BluebirdPromise;
  };
}
