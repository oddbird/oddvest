import { getProjects } from './lib/harvest';
import { getProjectId, setProjectId, TrelloPromise } from './lib/store';

export default () => {
  const t = TrelloPowerUp.iframe();

  const settingsForm = document.getElementById('settingsForm');
  /* istanbul ignore else */
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const projectId = document.getElementById(
        'projectId',
      ) as HTMLSelectElement | null;
      await setProjectId(t, (projectId && projectId.value) || '');
      t.closePopup();
    });
  }

  t.render(() =>
    TrelloPromise.all([getProjectId(t), getProjects(t)]).then(
      ([currentProjectId, data]) => {
        const sel = document.getElementById(
          'projectId',
        ) as HTMLSelectElement | null;
        /* istanbul ignore if */
        if (!sel) {
          return;
        }
        for (const project of data.projects) {
          const opt = document.createElement('option');
          opt.value = project.id.toString();
          opt.text = project.name;
          if (project.id === currentProjectId) {
            opt.defaultSelected = true;
          }
          sel.add(opt);
        }
        t.sizeTo('#settingsForm');
      },
    ),
  );
};
