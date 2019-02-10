import Vue from 'vue';
import Vuex from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSave,
  faUndo,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';

import store from './store';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

library.add(
  faSave,
  faUndo,
  faRedo,
);
Vue.component('font-awesome', FontAwesomeIcon);

Vue.use(require('vue-moment'));

Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
