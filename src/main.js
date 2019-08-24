import Vue from 'vue';
import Vuex from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import store from './store';
import App from './App.vue';
import router from './router';

import autofocus from 'vue-autofocus-directive';

Vue.use(Vuex);

Vue.directive('autofocus', autofocus);

Vue.config.productionTip = false;

library.add(
  fas.faSave,
  fas.faUndo,
  fas.faRedo,
  fas.faPlusCircle,
  fas.faTimesCircle,
  fas.faChevronCircleDown,
  fas.faAsterisk,
  fas.faPlus
);

Vue.component('font-awesome', FontAwesomeIcon);

Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');