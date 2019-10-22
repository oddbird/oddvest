import { getHarvestJSON } from './lib/harvest';
import { getProjectId, setProjectId, TrelloPromise } from './lib/store';

interface Project {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  is_billable: boolean;
  is_fixed_fee: boolean;
  bill_by: string | null;
  hourly_rate: number | null;
  budget: number | null;
  budget_by: string | null;
  budget_is_monthly: boolean;
  notify_when_over_budget: boolean;
  over_budget_notification_percentage: number | null;
  over_budget_notification_date: string | null;
  show_budget_to_all: boolean;
  cost_budget: number | null;
  cost_budget_include_expenses: boolean;
  fee: number | null;
  notes: string;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
  updated_at: string;
  client: { id: number; name: string; currency: string };
}

interface ProjectsData extends HarvestAPIReponse {
  projects: Project[];
}

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
    TrelloPromise.all([
      getProjectId(t),
      getHarvestJSON(t, 'projects?is_active=true'),
    ]).then(([currentProjectId, data]: [number, ProjectsData]) => {
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
    }),
  );
};
