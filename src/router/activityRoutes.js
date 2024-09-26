import ClassesDescriptions from '@/const/ClassesDescriptions';
import AccessRoles from '@/const/AccessRoles';

export default [
  {
    path: '/activities',
    name: 'activities',
    component: () => import('@/views/activities/ActivitiesView.vue'),
    meta: {
      icon: 'mdi-television-play',
      order: 80,
      name: 'Activities',
      breadcrumbs: [
        { text: 'Activities', disabled: true },
      ],
      infoMessage: ClassesDescriptions.ACTIVITY,
    },
  },
  {
    path: '/activities/:id([0-9a-fA-F]+)',
    name: 'activity-detailed',
    component: () => import('@/views/activities/ActivityDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Activities', href: '/activities' },
        { text: 'Activity :id', disabled: true },
      ],
      infoMessage: ClassesDescriptions.ACTIVITY,
    },
  },
  {
    path: '/activities/create',
    name: 'activity-creation',
    component: () => import('@/views/CreateActivityView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Activities', href: '/activities' },
        { text: 'Create new', disabled: true },
      ],
      infoMessage: ClassesDescriptions.ACTIVITY,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
];