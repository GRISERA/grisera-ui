import ClassesDescriptions from '@/const/ClassesDescriptions';

export default [
  {
    path: '/modalities',
    name: 'modalities',
    component: () => import('@/views/modalities/ModalitiesView.vue'),
    meta: {
      icon: 'mdi-format-list-bulleted',
      order: 30,
      name: 'Modalities',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Modalities', disabled: true },
      ],
      infoMessage: ClassesDescriptions.MODALITY,
    },
  },
];
