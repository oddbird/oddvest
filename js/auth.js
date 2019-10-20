var t = window.TrelloPowerUp.iframe();

t.render(function() {
  return t.sizeTo('#content');
})

var redirectUri = window.origin + '/auth_success.html';

var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {
  t.get('board', 'shared', 'harvestClientId').then(function (clientId) {
    return 'https://id.getharvest.com/oauth2/authorize?client_id=' +
      clientId + '&response_type=token&redirect_uri=' + encodeURIComponent(redirectUri);
  }).then( function (oauthUrl) {
    t.authorize(oauthUrl)
    .then(function(token) {
      return t.set('member', 'private', 'harvestAuthToken', token)
    })
    .then(function() {
      return t.closePopup();
    });
  });
});

