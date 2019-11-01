import BluebirdPromise from 'bluebird';

interface TrelloSync {
  signUrl: (url: string, args?: { [key: string]: string }) => string;
}

interface TrelloAsync {
  [key: string]: (...args: any[]) => BluebirdPromise<any>;
}

declare global {
  const TrelloPowerUp: {
    initialize: (opts: { [key: string]: (t: Trello) => any }) => void;
    iframe: () => Trello;
    Promise: typeof BluebirdPromise;
  };

  type Trello = TrelloSync & TrelloAsync;

  type HarvestAPIResponse = {
    per_page: number;
    total_pages: number;
    total_entries: number;
    next_page: number | null;
    previous_page: number | null;
    page: number;
    links: {
      first: string;
      next: string | null;
      previous: string | null;
      last: string;
    };
  };
}
