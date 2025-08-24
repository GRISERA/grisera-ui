import ClassesDescriptions from '@/const/ClassesDescriptions';

export default [
  {
    path: '/participants',
    name: 'participants',
    component: () => import('@/views/participants/ParticipantsView.vue'),
    meta: {
      icon: 'mdi-account-group',
      order: 70,
      name: 'Participants',
      breadcrumbs: [
        { text: 'Participants', disabled: true },
      ],
      infoMessage: ClassesDescriptions.PARTICIPANT,
    },
  },
];
