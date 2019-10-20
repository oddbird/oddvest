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
        row.insertCell().innerHTML = devName;
        row.insertCell().innerHTML = hours.toFixed(1);
      }
      const totalRow = table.insertRow();
      totalRow.insertCell().innerHTML = "Total";
      totalRow.insertCell().innerHTML = Object.values(hoursByDev).reduce(
        (sum, val) => { return sum + val; }, 0).toFixed(1);
      container.innerHTML = "";
      container.appendChild(table);
    }).then(() => {
      t.sizeTo('#allContainer');
    });
  });
});
