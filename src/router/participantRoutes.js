import ClassesDescriptions from '@/const/ClassesDescriptions';
import AccessRoles from '@/const/AccessRoles';

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
  {
    path: '/participants/create',
    name: 'participant-creation',
    component: () => import('@/views/CreateParticipantView.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Participants', href: '/participants' },
        { text: 'Create new', disabled: true },
      ],
      infoMessage: ClassesDescriptions.PARTICIPANT,
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
    },
  },
];