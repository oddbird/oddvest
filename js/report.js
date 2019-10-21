const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

t.render(() =>
  Promise.all([getTask(t), getProjectId(t)]).then(([task, projectId]) => {
    const container = document.getElementById('reportContainer');
    if (!task) {
      container.innerHTML = '';
      t.sizeTo('#allContainer');
      return;
    }
    document.getElementById('harvestTaskName').innerHTML = task.name;
    const table = document.createElement('table');
    getHarvestJSON(t, `time_entries?project_id=${projectId}`)
      .then((data) => {
        const taskEntries = data.time_entries.filter(
          (entry) => entry.task.id === task.id,
        );
        const budget =
          taskEntries.length && taskEntries[0].task_assignment
            ? taskEntries[0].task_assignment.budget
            : null;
        const hoursByDev = taskEntries.reduce((acc, entry) => {
          acc[entry.user.name] = (acc[entry.user.name] || 0) + entry.hours;
          return acc;
        }, {});
        for (const [devName, hours] of Object.entries(hoursByDev)) {
          const row = table.insertRow();
          row.insertCell().innerHTML = devName;
          row.insertCell().innerHTML = hours.toFixed(1);
        }
        const totalRow = table.insertRow();
        totalRow.insertCell().innerHTML = 'Total';
        totalRow.insertCell().innerHTML = Object.values(hoursByDev)
          .reduce((sum, val) => sum + val, 0)
          .toFixed(1);
        container.innerHTML = '';
        if (budget) {
          const p = document.createElement('p');
          p.innerHTML = `Budgeted: ${budget} hours.`;
          container.appendChild(p);
        }
        container.appendChild(table);
      })
      .then(() => {
        t.sizeTo('#allContainer');
      });
  }),
);
