const t = window.TrelloPowerUp.iframe();

t.render(() => t.sizeTo('#content'));

const redirectUri = t.signUrl(`${window.origin}/auth_success.html`);

const authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', () => {
  getClientId(t)
    .then(
      (clientId) =>
        `https://id.getharvest.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}`,
    )
    .then((oauthUrl) => {
      t.authorize(oauthUrl)
        .then((token) => setAuthToken(t, token))
        .then(() => t.closePopup());
    });
});
