import { getTaskAssignments, getTimeEntries } from './lib/harvest';
import { getProjectId, getTask, TrelloPromise } from './lib/store';

export default () => {
  const t = TrelloPowerUp.iframe();

  t.render(() =>
    TrelloPromise.all([getTask(t), getProjectId(t)]).then(
      ([task, projectId]) => {
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
        TrelloPromise.all([
          getTimeEntries(t, projectId),
          getTaskAssignments(t, projectId),
        ]).then(([timeEntriesData, taskAssignmentsData]) => {
          // Add time entry info
          const table = document.createElement('table');
          const taskEntries = timeEntriesData.time_entries.filter(
            (entry) => entry.task.id === task.id,
          );
          const hoursByDev = taskEntries.reduce(
            (acc, entry) => {
              acc[entry.user.name] = (acc[entry.user.name] || 0) + entry.hours;
              return acc;
            },
            {} as { [key: string]: number },
          );
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
          const taskAssignment = taskAssignmentsData.task_assignments.find(
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
      },
    ),
  );
};
