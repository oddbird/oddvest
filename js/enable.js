var t = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

window.enableForm.addEventListener('submit', function(event){
  event.preventDefault();
  return Promise.all([
      t.set('board', 'shared', 'harvestClientId', window.clientId.value),
      t.set('board', 'shared', 'harvestAccountId', window.accountId.value),
  ]).then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return Promise.all([
    t.get('board', 'shared', 'harvestClientId'),
    t.get('board', 'shared', 'harvestAccountId'),
  ])
  .then(function (ids) {
    window.clientId.value = ids[0] || '';
    window.accountId.value = ids[1] || '';
  }).then(function () {
    t.sizeTo('#enableForm').done();
  });
});

