import { getHarvestJSON } from './lib/harvest';
import { getProjectId, getTask, setTask, TrelloPromise } from './lib/store';

const t = TrelloPowerUp.iframe();

window.setTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const sel = document.getElementById('taskId');
  const selectedOption = sel.selectedOptions[0];
  const task =
    selectedOption && selectedOption.value
      ? { id: parseInt(selectedOption.value, 10), name: selectedOption.text }
      : null;
  return setTask(t, task).then(() => {
    t.closePopup();
  });
});

t.render(() =>
  TrelloPromise.all([getTask(t), getProjectId(t)])
    .then((taskAndProject) => {
      const currentTask = taskAndProject[0];
      const projectId = taskAndProject[1];
      // TODO if we ever assign more than 100 tasks to a single project, this
      // will break due to API pagination. So let's not do that, m'kay.
      getHarvestJSON(
        t,
        `projects/${projectId}/task_assignments?is_active=true`,
      ).then((data) => {
        const sel = document.getElementById('taskId');
        for (const assignment of data.task_assignments) {
          const opt = document.createElement('option');
          opt.value = assignment.task.id;
          opt.text = assignment.task.name;
          if (currentTask && assignment.task.id === currentTask.id) {
            opt.defaultSelected = true;
          }
          sel.add(opt);
        }
      });
    })
    .then(() => {
      t.sizeTo('#setTaskForm').done();
    }),
);
