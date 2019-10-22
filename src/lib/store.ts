export const TrelloPromise = TrelloPowerUp.Promise;

export const getClientId = (t: Trello) =>
  t.get('board', 'shared', 'harvestClientId');

export const setEnableConfig = (
  t: Trello,
  {
    clientId,
    accountId,
  }: {
    clientId: string;
    accountId: string;
  },
) =>
  t.set('board', 'shared', {
    harvestClientId: clientId,
    harvestAccoundId: accountId,
  });

export const getEnableConfig = (t: Trello) =>
  TrelloPromise.all([
    getClientId(t),
    t.get('board', 'shared', 'harvestAccountId'),
  ]).then(([clientId, accountId]: [string, string]) => ({
    clientId,
    accountId,
  }));

export const setAuthToken = (t: Trello, token: string) =>
  // TODO This API uses localStorage, ideally we'd catch any error here if
  // localStorage is disabled and clarify that it needs to be turned on.
  t.storeSecret('harvestAuthToken', token);

export const getAuthToken = (t: Trello) =>
  t.loadSecret('harvestAuthToken').catch((e) => {
    console.error(e);
    return null;
  });

export const setProjectId = (t: Trello, projectId: string) =>
  t.set('board', 'shared', 'harvestProjectId', projectId);

export const getProjectId = (t: Trello) =>
  t
    .get('board', 'shared', 'harvestProjectId')
    .then((projectIdStr) => parseInt(projectIdStr, 10));

// taskData is {id, name} object
export const setTask = (
  t: Trello,
  taskData: { id: number; name: string } | null,
) => t.set('card', 'shared', 'harvestTask', JSON.stringify(taskData));

export const getTask = (t: Trello) =>
  t
    .get('card', 'shared', 'harvestTask')
    .then((taskStr) => (taskStr ? JSON.parse(taskStr) : null));
