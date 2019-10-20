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
    getHarvestJSON(t, 'projects?is_active=true').then(function (data) {
      var sel = document.getElementById('projectId');
      for (const project of data.projects) {
        var opt = document.createElement('option');
        opt.value = project.id;
        opt.text = project.name;
        if (project.id === currentProjectId) {
          opt.defaultSelected = true;
        }
        sel.add(opt);
      }
    });
  }).then(function () {
    t.sizeTo('#settingsForm').done();
  });
});

