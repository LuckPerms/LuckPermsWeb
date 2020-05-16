import Vue from 'vue';
import Vuex from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSave,
  faUndo,
  faRedo,
  faPlusCircle,
  faTimes,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
  faPlus,
  faSyncAlt,
  faBook,
  faArrowAltCircleDown,
  faArrowLeft,
  faCaretRight,
  faEdit,
  faCheck,
  faHome,
  faCommentAlt,
  faTools,
  faMinus,
  faSitemap,
  faPlusSquare,
  faMinusSquare,
  faQuestionCircle,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faDiscord,
  faPatreon,
} from '@fortawesome/free-brands-svg-icons';

import autofocus from 'vue-autofocus-directive';
import VueClipboard from 'vue-clipboard2';

import store from './store';
import App from './App.vue';
import router from './router';

require('@/scss/_index.scss');

Vue.use(Vuex);

Vue.directive('autofocus', autofocus);

Vue.config.productionTip = false;

library.add(
  faSave,
  faUndo,
  faRedo,
  faPlusCircle,
  faTimes,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
  faPlus,
  faSyncAlt,
  faBook,
  faArrowAltCircleDown,
  faArrowLeft,
  faCaretRight,
  faEdit,
  faCheck,
  faHome,
  faCommentAlt,
  faTools,
  faMinus,
  faSitemap,
  faPlusSquare,
  faMinusSquare,
  faQuestionCircle,
  faBars,

  faGithub,
  faDiscord,
  faPatreon,
);

Vue.component('font-awesome', FontAwesomeIcon);

Vue.use(require('vue-moment'));
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
