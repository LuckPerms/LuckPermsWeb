import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/download',
      name: 'download',
      component: () => import(/* webpackChunkName: "download" */ './views/Download'),
    },
	{
	  path: '/wiki',
	  redirect: '/wiki/Home',
	},
	{
	  path: '/wiki/:page',
	  name: 'wiki',
	  component: () => import(/* webpackChunkName: "wiki" */ './views/Wiki'),
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
  ],
});
