import Vue from 'vue';
import VueRouter from 'vue-router';

import activityRoutes from '@/router/activityRoutes';
import channelRoutes from '@/router/channelRoutes';
import experimentRoutes from '@/router/experimentRoutes';
import modalityRoutes from '@/router/modalityRoutes';
import participantRoutes from '@/router/participantRoutes';
import measureRoutes from '@/router/measureRoutes';
import datasetRoutes from '@/router/datasetRoutes';
import ClassesDescriptions from '@/const/ClassesDescriptions';
import AuthService from '@/services/AuthService';
import store from '@/store/index';
import AccessRoles from '@/const/AccessRoles';

Vue.use(VueRouter);

const routes = [
  ...activityRoutes,
  ...channelRoutes,
  ...datasetRoutes,
  ...experimentRoutes,
  ...measureRoutes,
  ...modalityRoutes,
  ...participantRoutes,
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/MainView.vue'),
    meta: {
      icon: 'mdi-home',
      order: 100,
      name: 'Home',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Home', disabled: true },
      ],
    },
  },
  {
    path: '/life-activities',
    name: 'lifeActivities',
    component: () => import('@/views/life-activities/LifeActivitiesView.vue'),
    meta: {
      icon: 'mdi-clipboard-list-outline',
      order: 40,
      name: 'Life activities',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Life activities', disabled: true },
      ],
      infoMessage: ClassesDescriptions.LIFE_ACTIVITY,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: {
      canEnterRoles: [AccessRoles.EDITOR, AccessRoles.OWNER],
      icon: 'mdi-cog',
      order: 20,
      name: 'Settings',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Settings', disabled: true },
      ],
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/views/AccessDeniedView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = AuthService.getIdTokenParsed();
  if(token) {
    router.app.$store.commit('setUser', token);
  }
  next();
});

router.beforeEach((to, from, next) => {
  if(to.meta.canEnterRoles && !to.meta.canEnterRoles.find(role => role == store.getters.getPermission.role)) {
    next('/access-denied');
  }

  next();
});

router.afterEach(({ name, params, meta: { breadcrumbs = [] } }) => {
  router.app.$root.breadcrumbs = breadcrumbs.map(entry => {
    let text = entry.text;
    let href = entry.href;

    Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`:${key}`, value);
        href = href?.replace(`:${key}`, value);
      },
    );

    return { ...entry, text, href };
  });
});

export default router;
