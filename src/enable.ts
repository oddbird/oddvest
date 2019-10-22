import { getEnableConfig, setEnableConfig } from './lib/store';

export default () => {
  const t = TrelloPowerUp.iframe();

  const enableForm = document.getElementById('enableForm');
  /* istanbul ignore else */
  if (enableForm) {
    enableForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const clientId = document.getElementById(
        'clientId',
      ) as HTMLInputElement | null;
      const accountId = document.getElementById(
        'accountId',
      ) as HTMLInputElement | null;
      await setEnableConfig(t, {
        clientId: (clientId && clientId.value) || '',
        accountId: (accountId && accountId.value) || '',
      });
      t.closePopup();
    });
  }

  t.render(async () => {
    const conf = await getEnableConfig(t);
    const clientId = document.getElementById(
      'clientId',
    ) as HTMLInputElement | null;
    const accountId = document.getElementById(
      'accountId',
    ) as HTMLInputElement | null;
    /* istanbul ignore else */
    if (clientId) {
      clientId.value = conf.clientId || '';
    }
    /* istanbul ignore else */
    if (accountId) {
      accountId.value = conf.accountId || '';
    }
    t.sizeTo('#enableForm');
  });
};
