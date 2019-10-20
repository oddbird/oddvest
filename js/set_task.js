var t = TrelloPowerUp.iframe();

window.setTaskForm.addEventListener('submit', function(event){
  event.preventDefault();
  return t.set('card', 'shared', 'harvestTaskName', window.taskName.value)
  .then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return t.get('card', 'shared', 'harvestTaskName')
  .then(function (taskName) {
    window.taskName.value = taskName || '';
  }).then(function () {
    t.sizeTo('#setTaskForm').done();
  });
});

