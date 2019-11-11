import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home,
    // },
    // {
    //   path: '/download',
    //   name: 'download',
    //   component: () => import(/* webpackChunkName: "download"  './views/Download'),
    // },
    {
      //path: '/editor',
      path: '/',
      name: 'editor-home',
      component: () => import(/* webpackChunkName: "editor" */ './views/Editor'),
    },
    {
      //path: '/editor/:id',
      path: '/:id',
      name: 'editor',
      component: () => import(/* webpackChunkName: "editor" */ './views/Editor'),
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
