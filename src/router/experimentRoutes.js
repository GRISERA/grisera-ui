import ClassesDescriptions from '@/const/ClassesDescriptions';
import AccessRoles from '@/const/AccessRoles';

export default [
  {
    path: '/experiments',
    name: 'experiments',
    component: () => import('@/views/experiments/ExperimentsView.vue'),
    meta: {
      icon: 'mdi-heart-half-full',
      order: 90,
      name: 'Experiments',
      breadcrumbs: [
        { text: 'Experiments', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
    },
  },
  {
    path: '/experiments/:id(\\d+)',
    name: 'experiment-detailed',
    component: () => import('@/views/experiment-details/ExperimentDetailedView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
    },
  },
  {
    path: '/experiments/create',
    name: 'experiment-creation',
    component: () => import('@/views/CreateExperimentView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Create new', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/scenarios/:id(\\d+)',
    name: 'experiment-scenario-edit',
    component: () => import('@/views/scenarios/ScenarioAddEditView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Scenario :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/scenarios',
    name: 'experiment-scenario-add',
    component: () => import('@/views/scenarios/ScenarioAddEditView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Create new scenario', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/scenarios/:scenario(\\d+)/activities/:id(\\d+)',
    name: 'experiment-scenario-activity-edit',
    component: () => import('@/views/activities/ActivityDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Scenario :scenario', disabled: true },
        { text: 'Activity :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.ACTIVITY,
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/activity-executions/:id(\\d+)',
    name: 'experiment-activity-execution-edit',
    component: () => import('@/views/ActivityExecutionAddEditView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Activity execution :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/activity-executions/:activityExecution(\\d+)/participants/:id(\\d+)',
    name: 'experiment-activity-execution-participant-edit',
    component: () => import('@/views/ActivityExecutionParticipantManagement.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        {
          text: 'Activity execution :activityExecution',
          href: '/experiments/:experiment/activity-executions/:activityExecution',
        },
        { text: 'Participant :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/activity-executions/:activityExecution(\\d+)/participants/:id(\\d+)/time-series',
    name: 'experiment-activity-execution-participant-time-series',
    component: () => import('@/views/time-series/TimeSeriesView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        {
          text: 'Activity execution :activityExecution',
          href: '/experiments/:experiment/activity-executions/:activityExecution',
        },
        { text: 'Participant :id', disabled: true },
        { text: 'Time series', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/activity-executions/:activityExecution(\\d+)/participants/:id(\\d+)/time-series/create',
    name: 'experiment-activity-execution-participant-time-series-create',
    component: () => import('@/views/time-series/CreateEditTimeSeriesView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        {
          text: 'Activity execution :activityExecution',
          href: '/experiments/:experiment/activity-executions/:activityExecution',
        },
        { text: 'Participant :id', disabled: true },
        { text: 'Time Series', href: '/experiments/:experiment/activity-executions/:activityExecution/participants/:id/time-series' },
        { text: 'Create new time series', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/activity-executions/:activityExecution(\\d+)/participants/:id(\\d+)/time-series/:timeSeriesId(\\d+)',
    name: 'experiment-activity-execution-participant-time-series-edit',
    component: () => import('@/views/time-series/CreateEditTimeSeriesView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        {
          text: 'Activity execution :activityExecution',
          href: '/experiments/:experiment/activity-executions/:activityExecution',
        },
        { text: 'Participant :id', disabled: true },
        { text: 'Time Series', href: '/experiments/:experiment/activity-executions/:activityExecution/participants/:id/time-series' },
        { text: 'Time series :timeSeriesId', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/recordings/:id(\\d+)',
    name: 'experiment-recording-edit',
    component: () => import('@/views/RecordingsAddEditView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Recording :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
  {
    path: '/experiments/:experiment(\\d+)/recordings',
    name: 'experiment-recording-add',
    component: () => import('@/views/RecordingsAddEditView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Experiments', href: '/experiments' },
        { text: 'Experiment :experiment', href: '/experiments/:experiment' },
        { text: 'Create new recording', disabled: true },
      ],
      infoMessage: ClassesDescriptions.EXPERIMENT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
];
