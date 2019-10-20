var t = TrelloPowerUp.iframe();

window.settingsForm.addEventListener('submit', function(event){
  event.preventDefault();
  return setProjectId(t, window.projectId.value) 
  .then(function(){
    t.closePopup();
  });
});

t.render(function () {
  return getProjectId(t)
  .then(function (currentProjectId) {
    var sel = document.getElementById('projectId');
    var opt = document.createElement('option');
    opt.value = currentProjectId;
    opt.text = "Project " + currentProjectId;
    sel.add(opt);
  }).then(function () {
    t.sizeTo('#settingsForm').done();
  });
});

