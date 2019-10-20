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

function setProjectId (t, projectId) {
  return t.set('board', 'shared', 'harvestProjectId', projectId);
}

function getProjectId(t) {
  return t.get('board', 'shared', 'harvestProjectId');
}

