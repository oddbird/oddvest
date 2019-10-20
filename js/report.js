var t = TrelloPowerUp.iframe();

t.render(function () {
    return t.get('card', 'shared', 'harvestTaskName').then(function (taskName) {
        document.getElementById('harvestTaskName').innerHTML = taskName;
    });
});
