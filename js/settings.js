const t = TrelloPowerUp.iframe();

window.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  return setProjectId(t, window.projectId.value).then(() => {
    t.closePopup();
  });
});

t.render(() =>
  getProjectId(t)
    .then((currentProjectId) => {
      getHarvestJSON(t, 'projects?is_active=true').then((data) => {
        const sel = document.getElementById('projectId');
        for (const project of data.projects) {
          const opt = document.createElement('option');
          opt.value = project.id;
          opt.text = project.name;
          if (project.id === currentProjectId) {
            opt.defaultSelected = true;
          }
          sel.add(opt);
        }
      });
    })
    .then(() => {
      t.sizeTo('#settingsForm').done();
    }),
);
