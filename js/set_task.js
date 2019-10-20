const Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

window.setTaskForm.addEventListener('submit', function(event){
  event.preventDefault();
  var sel = document.getElementById('taskId');
  var selectedOption = sel.selectedOptions[0];
  const task = selectedOption && selectedOption.value ?
    {id: parseInt(selectedOption.value), name: selectedOption.text}
    : null;
  return setTask(t, task)
  .then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return Promise.all([
    getTask(t),
    getProjectId(t),
  ])
  .then(function (taskAndProject) {
    const currentTask = taskAndProject[0];
    const projectId = taskAndProject[1];
    // TODO if we ever assign more than 100 tasks to a single project, this will break
    // due to API pagination. So let's not do that, m'kay.
    getHarvestJSON(t, 'projects/' + projectId + '/task_assignments?is_active=true')
    .then(function (data) {
      var sel = document.getElementById('taskId');
      for (const assignment of data.task_assignments) {
        var opt = document.createElement('option');
        opt.value = assignment.task.id;
        opt.text = assignment.task.name;
        if (currentTask && (assignment.task.id === currentTask.id)) {
          opt.defaultSelected = true;
        }
        sel.add(opt);
      }
    });
  }).then(function () {
    t.sizeTo('#setTaskForm').done();
  });
});

