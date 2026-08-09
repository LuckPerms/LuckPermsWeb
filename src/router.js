import { createRouter, createWebHistory } from 'vue-router';

import config from '../config.json';
import Home from './views/Home.vue';
import NotFound from './views/NotFound.vue';

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
  {
    path: '/editor',
    name: 'editor-home',
    component: () => import('./views/Editor.vue'),
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import('./views/Editor.vue'),
  },
  {
    path: '/verbose',
    name: 'verbose-home',
    component: () => import('./views/Verbose.vue'),
  },
  {
    path: '/verbose/:id',
    name: 'verbose',
    component: () => import('./views/Verbose.vue'),
  },
  {
    path: '/treeview',
    name: 'tree-home',
    component: () => import('./views/Tree.vue'),
  },
  {
    path: '/treeview/:id',
    name: 'tree',
    component: () => import('./views/Tree.vue'),
  },
];

if (!config.selfHosted) {
  routes = [
    ...routes,
    {
      path: '/download',
      name: 'download',
      component: () => import('./views/Download.vue'),
    },
    {
      path: '/sponsor',
      name: 'sponsor',
      component: () => import('./views/Sponsor.vue'),
    },
  ];
}

export default createRouter({
  history: createWebHistory(config.base),
  routes,
});
