const Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(() => {
  return Promise.all([
    getTask(t),
    getProjectId(t),
  ]).then(([task, projectId]) => {
    if (!task) { return };
    document.getElementById('harvestTaskName').innerHTML = task.name;
    const container = document.getElementById('reportContainer');
    const table = document.createElement('table');
    getHarvestJSON(t, 'time_entries?project_id=' + projectId)
    .then((data) => {
      const hoursByDev = data.time_entries.filter(
        (entry) => { return entry.task.id === task.id; }
      ).reduce(
        (acc, entry) => {
          acc[entry.user.name] = (acc[entry.user.name] || 0) + entry.hours;
          return acc;
        },
        {},
      );
      for (const [devName, hours] of Object.entries(hoursByDev)) {
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const hoursCell = row.insertCell();
        nameCell.innerHTML = devName;
        hoursCell.innerHTML = hours;
      }
      container.innerHTML = "";
      container.appendChild(table);
    }).then(() => {
      t.sizeTo('#allContainer');
    });
  });
});
