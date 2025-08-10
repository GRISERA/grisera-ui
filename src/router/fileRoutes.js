export default [
  {
    path: '/files',
    name: 'files',
    component: () => import('@/views/files/FilesView.vue'),
    meta: {
      icon: 'mdi-file-multiple',
      order: 25,
      name: 'Files',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Files', disabled: true },
      ],
    },
  },
];