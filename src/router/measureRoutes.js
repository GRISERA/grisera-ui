import ClassesDescriptions from '@/const/ClassesDescriptions';
import AccessRoles from '@/const/AccessRoles';

export default [
    {
      path: '/measures',
      name: 'measures',
      component: () => import('@/views/measures/MeasuresView.vue'),
      meta: {
        icon: 'mdi-speedometer',
        order: 60,
        name: 'Measures',
        breadcrumbs: [
          { text: 'Measures', disabled: true },
        ],
      infoMessage: ClassesDescriptions.MEASURE,
      },
    },
    {
      path: '/measures/create',
      name: 'measure-creation',
      component: () => import('@/views/CreateEditMeasureView.vue'),
      meta: {
        breadcrumbs: [
          { text: 'Measures', href: '/measures' },
          { text: 'Create new', disabled: true },
        ],
      infoMessage: ClassesDescriptions.MEASURE,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
      },
    },
    {
      path: '/measures/edit/:id([0-9a-fA-F]+)',
      name: 'measure-edit',
      component: () => import('@/views/CreateEditMeasureView.vue'),
      meta: {
        breadcrumbs: [
          { text: 'Measures', href: '/measures' },
          { text: 'Edit', disabled: true },
        ],
      infoMessage: ClassesDescriptions.MEASURE,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
      },
    },
  ];