var t = TrelloPowerUp.iframe();

window.enableForm.addEventListener('submit', function(event){
  event.preventDefault();
  return t.set('board', 'shared', 'harvestClientId', window.clientId.value)
  .then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return t.get('board', 'shared', 'harvestClientId')
  .then(function (clientId) {
    window.clientId.value = clientId || '';
  }).then(function () {
    t.sizeTo('#enableForm').done();
  });
});

