function setEnableConfig (t, obj) {
  return Promise.all([
      t.set('board', 'shared', 'harvestClientId', obj.clientId),
      t.set('board', 'shared', 'harvestAccountId', obj.accountId),
  ]);
}

function getEnableConfig (t) {
  return Promise.all([
    getClientId(t),
    t.get('board', 'shared', 'harvestAccountId'),
  ])
  .then( function ([clientId, accountId]) {
    return {
      clientId,
      accountId,
    };
  });
}

function getClientId (t) {
  return t.get('board', 'shared', 'harvestClientId');
}

function setAuthToken (t, token) {
  // TODO This API uses localStorage, ideally we'd catch any error here if
  // localStorage is disabled and clarify that it needs to be turned on.
  return t.storeSecret('harvestAuthToken', token);
}

function getAuthToken (t) {
  return t.loadSecret('harvestAuthToken').catch( function (e) {
    console.log(e);
    return null;
  });
}

function setProjectId (t, projectId) {
  return t.set('board', 'shared', 'harvestProjectId', projectId);
}

function getProjectId(t) {
  return t.get('board', 'shared', 'harvestProjectId')
  .then(function (projectIdStr) {
    return parseInt(projectIdStr);
  });
}

// taskData is {id, name} object
function setTask (t, taskData) {
  return t.set('card', 'shared', 'harvestTask', JSON.stringify(taskData));
}

function getTask (t) {
  return t.get('card', 'shared', 'harvestTask')
  .then(function (taskStr) {
    return taskStr ? JSON.parse(taskStr) : null;
  });
}

