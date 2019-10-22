import { getClientId, setAuthToken } from './lib/store';

export default () => {
  const t = TrelloPowerUp.iframe();

  t.render(() => t.sizeTo('#content'));

  const redirectUri = encodeURIComponent(
    t.signUrl(`${window.origin}/auth_success.html`),
  );

  const authBtn = document.getElementById('authorize');
  /* istanbul ignore if */
  if (!authBtn) {
    return;
  }
  authBtn.addEventListener('click', async () => {
    const clientId = await getClientId(t);
    // eslint-disable-next-line max-len
    const oauthUrl = `https://id.getharvest.com/oauth2/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}`;
    const token = await t.authorize(oauthUrl);
    await setAuthToken(t, token);
    t.closePopup();
  });
};
