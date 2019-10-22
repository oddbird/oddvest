import { getEnableConfig, setEnableConfig } from './lib/store';

export default () => {
  const t = TrelloPowerUp.iframe();

  const enableForm = document.getElementById('enableForm');
  /* istanbul ignore else */
  if (enableForm) {
    enableForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const clientId = document.getElementById(
        'clientId',
      ) as HTMLInputElement | null;
      const accountId = document.getElementById(
        'accountId',
      ) as HTMLInputElement | null;
      setEnableConfig(t, {
        clientId: (clientId && clientId.value) || '',
        accountId: (accountId && accountId.value) || '',
      }).then(() => {
        t.closePopup();
      });
    });
  }

  t.render(() =>
    getEnableConfig(t)
      .then((conf) => {
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
      })
      .then(() => {
        t.sizeTo('#enableForm');
      }),
  );
};
