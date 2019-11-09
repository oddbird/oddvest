import { getTaskAssignments, getTimeEntries } from './lib/harvest';
import { getProjectId, getTask } from './lib/store';
import { summarizeTimeEntries } from './lib/time';

export default () => {
  const t = TrelloPowerUp.iframe();

  t.render(async () => {
    const [task, projectId] = await Promise.all([getTask(t), getProjectId(t)]);
    const taskName = document.getElementById('harvestTaskName');
    /* istanbul ignore else */
    if (taskName) {
      taskName.innerHTML = task ? task.name : 'not set';
    }
    const container = document.getElementById('reportContainer');
    if (!task || !container) {
      if (container) {
        container.innerHTML = '';
      }
      t.sizeTo('#allContainer');
      return;
    }
    const [timeEntries, taskAssignments] = await Promise.all([
      getTimeEntries(t, projectId),
      getTaskAssignments(t, projectId),
    ]);
    // Add time entry info
    const table = document.createElement('table');
    const hoursByDev = summarizeTimeEntries(timeEntries)[task.id] || {};
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

    // Add budget info
    const taskAssignment = taskAssignments.find(
      (assignment) => assignment.task.id === task.id,
    );
    const budget = taskAssignment ? taskAssignment.budget : null;
    if (budget) {
      const p = document.createElement('p');
      p.innerHTML = `Budgeted: ${budget} hours.`;
      container.appendChild(p);
    }
    container.appendChild(table);
    t.sizeTo('#allContainer');
  });
};
