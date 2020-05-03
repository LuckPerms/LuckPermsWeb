import Vue from 'vue';
import Vuex from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faSave,
  faUndo,
  faRedo,
  faPlusCircle,
  faExclamationCircle,
  faTimes,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
  faPlus,
  faSyncAlt,
  faBook,
  faLanguage,
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
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faDiscord,
  faPatreon,
} from '@fortawesome/free-brands-svg-icons';

import autofocus from 'vue-autofocus-directive';
import VueClipboard from 'vue-clipboard2';
import CountryFlag from 'vue-country-flag';
import VueI18n from 'vue-i18n';

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
  faExclamationCircle,
  faTimes,
  faTimesCircle,
  faChevronCircleDown,
  faAsterisk,
  faPlus,
  faSyncAlt,
  faBook,
  faLanguage,
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

  faGithub,
  faDiscord,
  faPatreon,
);

Vue.component('font-awesome', FontAwesomeIcon);
Vue.component('country-flag', CountryFlag);

Vue.use(require('vue-moment'));
Vue.use(VueI18n);
Vue.use(VueClipboard);

const messages = {
  "de": {
    "nav": {
      "home": "Hauptseite",
      "download": "Herunterladen",
      "wiki": "Wiki",
      "tools": "Werkzeuge",
      "editor": "Bearbeiter",
      "verbose": "Verbose",
      "tree": "Baum",
      "languages": "Sprachen"
    }
  },
  "en": {
    "nav": {
      "home": "Home",
      "download": "Download",
      "wiki": "Wiki",
      "tools": "Tools",
      "editor": "Editor",
      "verbose": "Verbose",
      "tree": "Tree",
      "languages": "Languages"
    }
  },
}

const i18n = new VueI18n({
  locale: require('@/../config').defaultLocale,
  messages,
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
