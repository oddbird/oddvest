function setEnableConfig (t, obj) {
  return Promise.all([
      t.set('board', 'shared', 'harvestClientId', obj.clientId),
      t.set('board', 'shared', 'harvestAccountId', obj.accountId),
  ]);
}

function getEnableConfig (t) {
  return Promise.all([
    t.get('board', 'shared', 'harvestClientId'),
    t.get('board', 'shared', 'harvestAccountId'),
  ])
  .then( function (ids) {
    return {
      clientId: ids[0],
      accountId: ids[1],
    };
  });
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
  return t.get('board', 'shared', 'harvestProjectId');
}

