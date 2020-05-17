import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

const config = require('../config.json');

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/editor',
    name: 'editor-home',
    component: () => import(/* webpackChunkName: "editor" */ './views/Editor'),
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import(/* webpackChunkName: "editor" */ './views/Editor'),
  },
  {
    path: '/verbose',
    name: 'verbose-home',
    component: () => import(/* webpackChunkName: "verbose" */ './views/Verbose'),
  },
  {
    path: '/verbose/:id',
    name: 'verbose',
    component: () => import(/* webpackChunkName: "verbose" */ './views/Verbose'),
  },
  {
    path: '/tree',
    name: 'tree-home',
    component: () => import(/* webpackChunkName: "tree" */ './views/Tree'),
  },
  {
    path: '/tree/:id',
    name: 'tree',
    component: () => import(/* webpackChunkName: "tree" */ './views/Tree'),
  },
];

if (!config.selfHosted) {
  routes.push({
    path: '/download',
    name: 'download',
    component: () => import(/* webpackChunkName: "download" */ './views/Download'),
  });
  routes.push({
    path: '/wiki',
    name: 'wiki',
    component: () => import(/* webpackChunkName: "wiki" */ './views/Wiki'),
    redirect: '/wiki/Home',
    children: [
      {
        path: ':page',
        name: 'wiki-article',
        component: () => import(/* webpackChunkName: "wiki" */ './components/Wiki/Article'),
      },
    ],
  });
}

export default new Router({
  mode: 'history',
  base: config.base,
  routes,
});
