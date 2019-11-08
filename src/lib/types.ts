type HarvestAPIResponse = {
  per_page: number;
  total_pages: number;
  total_entries: number;
  next_page: number | null;
  previous_page: number | null;
  page: number;
  links: {
    first: string;
    next: string | null;
    previous: string | null;
    last: string;
  };
};

export interface TaskAssignment {
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

export interface TaskAssignmentsResponse extends HarvestAPIResponse {
  task_assignments: TaskAssignment[];
}

export interface TimeEntry {
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

export interface TimeEntriesResponse extends HarvestAPIResponse {
  time_entries: TimeEntry[];
}

export interface Project {
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

export interface ProjectsResponse extends HarvestAPIResponse {
  projects: Project[];
}
