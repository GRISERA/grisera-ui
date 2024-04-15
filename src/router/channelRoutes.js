import ClassesDescriptions from '@/const/ClassesDescriptions';

export default [
  {
    path: '/channels',
    name: 'channels',
    component: () => import('@/views/channels/ChannelsView.vue'),
    meta: {
      icon: 'mdi-signal',
      order: 50,
      name: 'Channels',
      breadcrumbs: [
        { text: 'Channels', disabled: true },
      ],
      infoMessage: ClassesDescriptions.CHANNEL,
    },
  },
];
