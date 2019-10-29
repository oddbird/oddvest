import { getHarvestJSON } from './lib/harvest';
import { getProjectId, getTask, TrelloPromise } from './lib/store';

interface TimeEntry {
  id: number;
  spent_date: string;
  hours: number;
  notes: string;
  is_locked: boolean;
  locked_reason: string | null;
  is_closed: boolean;
  is_billed: boolean;
  timer_started_at: string | null;
  started_time: string | null;
  ended_time: string | null;
  is_running: boolean;
  billable: boolean;
  budgeted: boolean;
  billable_rate: number | null;
  cost_rate: number | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string };
  client: { id: number; name: string; currency: string };
  project: { id: number; name: string; code: string };
  task: { id: number; name: string };
  user_assignment: {
    id: number;
    is_project_manager: boolean;
    is_active: boolean;
    use_default_rates: boolean;
    budget: number | null;
    created_at: string;
    updated_at: string;
    hourly_rate: number | null;
  };
  task_assignment: {
    id: number;
    billable: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    hourly_rate: number | null;
    budget: number | null;
  };
  invoice: { id: number; number: string } | null;
  external_reference: {
    id: string;
    group_id: string;
    permalink: string;
    service: string;
    service_icon_url: string;
  };
}

interface TimeEntriesData extends HarvestAPIResponse {
  time_entries: TimeEntry[];
}

export default () => {
  const t = TrelloPowerUp.iframe();

  t.render(() =>
    TrelloPromise.all([getTask(t), getProjectId(t)]).then(
      async ([task, projectId]) => {
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
        const table = document.createElement('table');
        const data: TimeEntriesData = await getHarvestJSON(
          t,
          `time_entries?project_id=${projectId}`,
        );
        const taskEntries = data.time_entries.filter(
          (entry) => entry.task.id === task.id,
        );
        const budget =
          taskEntries.length && taskEntries[0].task_assignment
            ? taskEntries[0].task_assignment.budget
            : null;
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
        if (budget) {
          const p = document.createElement('p');
          p.innerHTML = `Budgeted: ${budget} hours.`;
          container.appendChild(p);
        }
        container.appendChild(table);
        t.sizeTo('#allContainer');
      },
    ),
  );
};
