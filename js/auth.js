var t = window.TrelloPowerUp.iframe();

t.render(function() {
  return t.sizeTo('#content');
})

var redirectUri = window.origin + '/harvest_auth_success.html';
// TODO move client ID to power-up settings
var oauthUrl = 'https://id.getharvest.com/oauth2/authorize?client_id=jsTKV5L8fuIjoGXYT3__7dbW&response_type=token&redirect_uri=' + encodeURIComponent(redirectUri);

var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {
  t.authorize(oauthUrl)
  .then(function(token) {
    return t.set('member', 'private', 'harvestAuthToken', token)
  })
  .then(function() {
    return t.closePopup();
  });
});

