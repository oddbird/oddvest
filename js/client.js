const GRAY_ICON =
  'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

window.TrelloPowerUp.initialize({
  'on-enable'(t, options) {
    return t.popup({
      title: 'Set up Oddvest',
      url: './enable.html',
      height: 184,
    });
  },
  'show-settings'(t, options) {
    return t.popup({
      title: 'Configure Oddvest',
      url: './settings.html',
      height: 184,
    });
  },
  'card-buttons'(t, options) {
    return [
      {
        icon:
          'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'Set Task',
        callback(t) {
          return t.popup({
            title: 'Set Task',
            url: 'set_task.html',
          });
        },
      },
    ];
  },
  'card-back-section'(t, options) {
    return {
      title: 'Harvest Time',
      icon: GRAY_ICON,
      content: {
        type: 'iframe',
        url: t.signUrl('./report.html'),
        height: 230, // Max height is 500
      },
    };
  },
  'card-badges'(t, options) {
    return getTask(t).then((task) => [
      {
        icon:
          'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717',
        text: task ? task.name : 'no task!',
        color: task ? null : 'red',
      },
    ]);
  },
  'card-detail-badges'(t, options) {
    return getTask(t).then((task) => [
      {
        title: 'Task',
        text: task ? task.name : 'no task!',
        color: task ? null : 'red',
        callback(t) {
          return t.popup({
            title: 'Set Task',
            url: 'set_task.html',
          });
        },
      },
    ]);
  },
  'authorization-status'(t, options) {
    return getAuthToken(t).then((authToken) =>
      // TODO actually check if the authToken is valid
      ({ authorized: authToken != null }),
    );
  },
  'show-authorization'(t, options) {
    return t.popup({
      title: 'Authorize Harvest Account',
      url: './auth.html',
      height: 140,
    });
  },
});
