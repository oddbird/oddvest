import { getEnableConfig, setEnableConfig } from './lib/store';

const t = TrelloPowerUp.iframe();

window.enableForm.addEventListener('submit', (event) => {
  event.preventDefault();
  setEnableConfig(t, {
    clientId: window.clientId.value,
    accountId: window.accountId.value,
  }).then(() => {
    t.closePopup();
  });
});

t.render(() =>
  getEnableConfig(t)
    .then((conf) => {
      window.clientId.value = conf.clientId || '';
      window.accountId.value = conf.accountId || '';
    })
    .then(() => {
      t.sizeTo('#enableForm').done();
    }),
);