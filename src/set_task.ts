import { getTaskAssignments } from './lib/harvest';
import { getProjectId, getTask, setTask } from './lib/store';

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

  t.render(async () => {
    const [currentTask, projectId] = await Promise.all([
      getTask(t),
      getProjectId(t),
    ]);
    const taskAssignments = await getTaskAssignments(t, projectId);
    const sel = document.getElementById('taskId') as HTMLSelectElement | null;
    /* istanbul ignore if */
    if (!sel) {
      return;
    }
    for (const assignment of taskAssignments) {
      const opt = document.createElement('option');
      opt.value = assignment.task.id.toString();
      opt.text = assignment.task.name;
      if (currentTask && assignment.task.id === currentTask.id) {
        opt.defaultSelected = true;
      }
      sel.add(opt);
    }
    t.sizeTo('#setTaskForm');
  });
};
