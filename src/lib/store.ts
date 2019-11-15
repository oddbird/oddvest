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
    harvestAccountId: accountId,
  });

export const getEnableConfig = async (t: Trello) => {
  const [clientId, accountId] = await Promise.all([
    getClientId(t),
    t.get('board', 'shared', 'harvestAccountId'),
  ]);
  return {
    clientId,
    accountId,
  };
};

export const setAuthToken = (t: Trello, token: string) =>
  // TODO This API uses localStorage, ideally we'd catch any error here if
  // localStorage is disabled and clarify that it needs to be turned on.
  t.storeSecret('harvestAuthToken', token);

export const getAuthToken = async (t: Trello) => {
  try {
    return await t.loadSecret('harvestAuthToken');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export const setProjectId = (t: Trello, projectId: string) =>
  t.set('board', 'shared', 'harvestProjectId', projectId);

export const getProjectId = async (t: Trello) => {
  const projectIdStr = await t.get('board', 'shared', 'harvestProjectId');
  return parseInt(projectIdStr, 10);
};

// taskData is {id, name} object
export const setTask = (
  t: Trello,
  taskData: { id: number; name: string } | null,
) => t.set('card', 'shared', 'harvestTask', JSON.stringify(taskData));

export const getTask = async (t: Trello) => {
  const taskStr = await t.get('card', 'shared', 'harvestTask');
  return taskStr ? JSON.parse(taskStr) : null;
};
