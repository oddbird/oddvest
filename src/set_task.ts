import { getTaskAssignments } from './lib/harvest';
import { getProjectId, getTask, setTask, TrelloPromise } from './lib/store';

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
        const taskAssignmentsResponse = await getTaskAssignments(t, projectId);
        const sel = document.getElementById(
          'taskId',
        ) as HTMLSelectElement | null;
        /* istanbul ignore if */
        if (!sel) {
          return;
        }
        for (const assignment of taskAssignmentsResponse.task_assignments) {
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
