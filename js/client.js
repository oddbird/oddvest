var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';

window.TrelloPowerUp.initialize({
  'on-enable': function(t, options){
    return t.popup({
      title: 'Set up Oddvest',
      url: './enable.html',
      height: 184
    });
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Configure Oddvest',
      url: './settings.html',
      height: 184
    });
  },
  'card-buttons': function(t, options){
    return [{
        icon: 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
        text: 'Set Task',
        callback: function (t) {
            return t.popup({
                title: "Set Task",
                url: 'set_task.html',
            });
        },
    }];
  },
  'card-back-section': function(t, options){
    return {
      title: 'Harvest Time',
      icon: GRAY_ICON, 
      content: {
        type: 'iframe',
        url: t.signUrl('./report.html'),
        height: 230 // Max height is 500
      }
    };
  },
  'card-badges': function(t, options) {
      return t.get('card', 'shared', 'harvestTaskName')
        .then(function(taskName) {

        return [{
            icon: 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717',
            text: taskName || "no task!",
            color: taskName ? null : 'red',
        }];
    });
  },
  'card-detail-badges': function(t, options) {
    return t.get('card', 'shared', 'harvestTaskName')
    .then(function(taskName) {
      return [{
        title: 'Task',
        text: taskName || 'no task!',
        color: taskName ? null : 'red',
        callback: function(t) {
          return t.popup({
            title: "Set Task",
            url: 'set_task.html',
          });
        }
      }]
    });
  },
  'authorization-status': function(t, options) {
    return t.get('member', 'private', 'harvestAuthToken')
    .then(function(authToken) {
      // TODO actually check if the authToken is valid
      return { authorized: authToken != null }
    });
  },
  'show-authorization': function(t, options){
    return t.popup({
      title: 'Authorize Harvest Account',
      url: './auth.html',
      height: 140,
    });
  }
});
