var t = TrelloPowerUp.iframe();

window.setTaskForm.addEventListener('submit', function(event){
  event.preventDefault();
  var sel = document.getElementById('taskId');
  var selectedOption = sel.selectedOptions[0];
  const task = {id: parseInt(selectedOption.value), name: selectedOption.text};
  return setTask(t, task)
  .then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return getTask(t)
  .then(function (currentTask) {
    ajaxGetHarvest(t, 'task_assignments?is_active=true').then(function (event) {
      var xhr = event.target;
      var assignments = JSON.parse(xhr.responseText).task_assignments;
      var sel = document.getElementById('taskId');
      for (const assignment of assignments) {
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

