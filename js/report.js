var t = TrelloPowerUp.iframe();

t.render(function () {
    return getTask(t).then(function (task) {
        document.getElementById('harvestTaskName').innerHTML = task ? task.name : "not set";
    });
});
