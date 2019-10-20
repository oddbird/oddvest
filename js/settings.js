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
    ajaxGetAsync(t, 'projects?is_active=true').then(function (event) {
      var xhr = event.target;
      var projects = JSON.parse(xhr.responseText).projects;
      var sel = document.getElementById('projectId');
      for (const project of projects) {
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

