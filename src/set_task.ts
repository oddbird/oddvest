import { getHarvestJSON } from './lib/harvest';
import { getProjectId, getTask, setTask, TrelloPromise } from './lib/store';

interface TaskAssignment {
  id: number;
  is_active: boolean;
  billable: boolean;
  created_at: string;
  updated_at: string;
  hourly_rate: number | null;
  budget: number | null;
  project: { id: number; name: string; code: string };
  task: { id: number; name: string };
}

interface TaskAssignmentsData extends HarvestAPIResponse {
  task_assignments: TaskAssignment[];
}

export default () => {
  const t = TrelloPowerUp.iframe();

  const setTaskForm = document.getElementById('setTaskForm');
  /* istanbul ignore else */
  if (setTaskForm) {
    setTaskForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const sel = document.getElementById('taskId') as HTMLSelectElement | null;
      const selectedOption = sel && sel.selectedOptions[0];
      const task =
        selectedOption && selectedOption.value
          ? {
              id: parseInt(selectedOption.value, 10),
              name: selectedOption.text,
            }
          : null;
      await setTask(t, task);
      t.closePopup();
    });
  }

  t.render(() =>
    TrelloPromise.all([getTask(t), getProjectId(t)]).then(
      async ([currentTask, projectId]) => {
        // @@@ TODO if we ever assign more than 100 tasks to a single project, this
        // will break due to API pagination. So let's not do that, m'kay.
        const data: TaskAssignmentsData = await getHarvestJSON(
          t,
          `projects/${projectId}/task_assignments?is_active=true`,
        );
        const sel = document.getElementById(
          'taskId',
        ) as HTMLSelectElement | null;
        /* istanbul ignore if */
        if (!sel) {
          return;
        }
        for (const assignment of data.task_assignments) {
          const opt = document.createElement('option');
          opt.value = assignment.task.id.toString();
          opt.text = assignment.task.name;
          if (currentTask && assignment.task.id === currentTask.id) {
            opt.defaultSelected = true;
          }
          sel.add(opt);
        }
        t.sizeTo('#setTaskForm');
      },
    ),
  );
};
