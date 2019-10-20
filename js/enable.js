var t = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

window.enableForm.addEventListener('submit', function(event){
  event.preventDefault();
  setEnableConfig(t, {
    clientId: window.clientId.value,
    accountId: window.accountId.value,
  }).then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return getEnableConfig(t)
  .then(function (conf) {
    window.clientId.value = conf.clientId || '';
    window.accountId.value = conf.accountId || '';
  }).then(function () {
    t.sizeTo('#enableForm').done();
  });
});

