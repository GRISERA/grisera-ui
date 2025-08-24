import ClassesDescriptions from '@/const/ClassesDescriptions';

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
];
