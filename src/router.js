import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

var projectRoutes = [];
if (!(require('@/../config').selfHosted)) {
  projectRoutes = [
    {
      path: '/download',
      name: 'download',
      component: () => import(/* webpackChunkName: "download" */ './views/Download'),
    },
    {
      path: '/wiki',
      name: 'wiki',
      component: () => import(/* webpackChunkName: "wiki" */ './views/Wiki'),
      redirect: '/wiki/Home',
      children: [
        {
          path: ':page',
          name: 'wiki-article',
          component: () => import(/* webpackChunkName: "wiki" */ './components/Wiki/Article'),
        }
      ]
    }
  ]
}

var routes = [
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
  {
    path: '*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ './views/NotFound'),
  },
]

export default new Router({
  mode: 'history',
  routes: routes.concat(projectRoutes),
});
