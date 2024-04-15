import ClassesDescriptions from '@/const/ClassesDescriptions';
import AccessRoles from '@/const/AccessRoles';

export default [
  {
    path: '/datasets',
    name: 'datasets',
    component: () => import('@/views/datasets/DatasetsView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Datasets', disabled: true },
      ],
      disableNavigation: true,
      infoMessage: ClassesDescriptions.DATASET,
    },
  },
  {
    path: '/datasets/create',
    name: 'dataset-creation',
    component: () => import('@/views/datasets/DatasetDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Datasets', href: '/datasets' },
        { text: 'Create', disabled: true },
      ],
      disableNavigation: true,
      infoMessage: ClassesDescriptions.DATASET,
    },
  },
  {
    path: '/datasets/:id(\\d+)/edit',
    name: 'dataset-edit',
    component: () => import('@/views/datasets/DatasetDetailedView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Datasets', href: '/datasets' },
        { text: 'Edit', disabled: true },
      ],
      disableNavigation: true,
      infoMessage: ClassesDescriptions.DATASET,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
];
