import Vue from 'vue';
import VueRouter from 'vue-router';

import activityRoutes from '@/router/activityRoutes';
import channelRoutes from '@/router/channelRoutes';
import experimentRoutes from '@/router/experimentRoutes';
import fileRoutes from '@/router/fileRoutes';
import modalityRoutes from '@/router/modalityRoutes';
import participantRoutes from '@/router/participantRoutes';
import measureRoutes from '@/router/measureRoutes';
import datasetRoutes from '@/router/datasetRoutes';
import ClassesDescriptions from '@/const/ClassesDescriptions';
import jwt_decode from 'jwt-decode';
import AuthService from '@/services/AuthService';
import store from '@/store/index';

Vue.use(VueRouter);

const routes = [
  ...activityRoutes,
  ...channelRoutes,
  ...datasetRoutes,
  ...experimentRoutes,
  ...fileRoutes,
  ...measureRoutes,
  ...modalityRoutes,
  ...participantRoutes,
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      disableNavigation: true,
      disableMainAppBar: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      disableNavigation: true,
      disableMainAppBar: true,
    },
  },
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
    path: '/imports',
    name: 'imports',
    component: () => import('@/views/imports/ImportsView.vue'),
    meta: {
      icon: 'mdi-import',
      order: 45,
      name: 'Data Imports',
      hideFilters: true,
      breadcrumbs: [
        { text: 'Data Imports', disabled: true },
      ],
      infoMessage: 'Manage and monitor your data import jobs.',
    },
  },
  {
    path: '/imports/create',
    name: 'import-creation',
    component: () => import('@/views/imports/CreateImportView.vue'),
    meta: {
      hideFilters: true,
      breadcrumbs: [
        { text: 'Data Imports', disabled: false, href: '/imports' },
        { text: 'Create', disabled: true },
      ],
      infoMessage: 'Upload a new file to create a data import job.',
    },
  },
  // {
  //   path: '/exports',
  //   name: 'exports',
  //   component: () => import('@/views/exports/ExportsView.vue'),
  //   meta: {
  //     icon: 'mdi-export',
  //     order: 46,
  //     name: 'Data Exports',
  //     hideFilters: true,
  //     breadcrumbs: [
  //       { text: 'Data Exports', disabled: true },
  //     ],
  //     infoMessage: 'Manage and monitor your data export jobs.',
  //   },
  // },
  // {
  //   path: '/exports/create',
  //   name: 'export-creation',
  //   component: () => import('@/views/exports/CreateExportView.vue'),
  //   meta: {
  //     hideFilters: true,
  //     breadcrumbs: [
  //       { text: 'Data Exports', disabled: false, href: '/exports' },
  //       { text: 'Create', disabled: true },
  //     ],
  //     infoMessage: 'Configure and start a new data export job.',
  //   },
  // },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: {
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
  const requiresAuth = to.name !== 'login' && to.name !== 'register';
  const isAuthenticated = !!(AuthService.isAuthenticated() || to.params.isAuthenticated);

  if(requiresAuth && !isAuthenticated) {
    next('/login');
  }
  else if(!requiresAuth && isAuthenticated) {
    next(from.path);
  }
  else {
    const token = localStorage.getItem('token');
    if(token) {
      router.app.$store.commit('setUser', jwt_decode(token));
    }
    next();
  }
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
