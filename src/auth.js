import { getClientId, setAuthToken } from './lib/store';

const t = TrelloPowerUp.iframe();

t.render(() => t.sizeTo('#content'));

const redirectUri = encodeURIComponent(
  t.signUrl(`${window.origin}/auth_success.html`),
);

const authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', () => {
  getClientId(t)
    .then(
      (clientId) =>
        // eslint-disable-next-line max-len
        `https://id.getharvest.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}`,
    )
    .then((oauthUrl) => {
      t.authorize(oauthUrl)
        .then((token) => setAuthToken(t, token))
        .then(() => t.closePopup());
    });
});
