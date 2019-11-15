import { getProjects } from './lib/harvest';
import { getProjectId, setProjectId } from './lib/store';

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

  t.render(async () => {
    const [currentProjectId, projects] = await Promise.all([
      getProjectId(t),
      getProjects(t),
    ]);
    const sel = document.getElementById(
      'projectId',
    ) as HTMLSelectElement | null;
    /* istanbul ignore if */
    if (!sel) {
      return;
    }
    for (const project of projects) {
      const opt = document.createElement('option');
      opt.value = project.id.toString();
      opt.text = project.name;
      if (project.id === currentProjectId) {
        opt.defaultSelected = true;
      }
      sel.add(opt);
    }
    t.sizeTo('#settingsForm');
  });
};
