export const TrelloPromise = TrelloPowerUp.Promise;

export const getClientId = (t) => t.get('board', 'shared', 'harvestClientId');

export const setEnableConfig = (t, obj) =>
  t.set('board', 'shared', {
    harvestClientId: obj.clientId,
    harvestAccoundId: obj.accountId,
  });

export const getEnableConfig = (t) =>
  TrelloPromise.all([
    getClientId(t),
    t.get('board', 'shared', 'harvestAccountId'),
  ]).then(([clientId, accountId]) => ({
    clientId,
    accountId,
  }));

export const setAuthToken = (t, token) =>
  // TODO This API uses localStorage, ideally we'd catch any error here if
  // localStorage is disabled and clarify that it needs to be turned on.
  t.storeSecret('harvestAuthToken', token);

export const getAuthToken = (t) =>
  t.loadSecret('harvestAuthToken').catch((e) => {
    console.error(e);
    return null;
  });

export const setProjectId = (t, projectId) =>
  t.set('board', 'shared', 'harvestProjectId', projectId);

export const getProjectId = (t) =>
  t
    .get('board', 'shared', 'harvestProjectId')
    .then((projectIdStr) => parseInt(projectIdStr, 10));

// taskData is {id, name} object
export const setTask = (t, taskData) =>
  t.set('card', 'shared', 'harvestTask', JSON.stringify(taskData));

export const getTask = (t) =>
  t
    .get('card', 'shared', 'harvestTask')
    .then((taskStr) => (taskStr ? JSON.parse(taskStr) : null));
