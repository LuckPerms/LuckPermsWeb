import Vue from 'vue';
import Vuex from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSave,
  faUndo,
  faRedo,
  faPlusCircle,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
} from '@fortawesome/free-solid-svg-icons';

import store from './store';
import App from './App.vue';
import router from './router';

Vue.use(Vuex);

Vue.config.productionTip = false;

library.add(
  faSave,
  faUndo,
  faRedo,
  faPlusCircle,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
);
Vue.component('font-awesome', FontAwesomeIcon);

Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
