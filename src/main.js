import Vue from 'vue';
import VueI18n from 'vue-i18n';
import autofocus from 'vue-autofocus-directive';
import VueClipboard from 'vue-clipboard2';
import VueMeta from 'vue-meta';

import store from '@/store';
import router from '@/router';
import i18n from '@/util/language';
import FontAwesome from '@/util/icons';
import App from '@/App.vue';

require('@/scss/_index.scss');

Vue.use(VueClipboard);
Vue.use(VueMeta);
Vue.use(VueI18n);
Vue.use(FontAwesome);
Vue.use(i18n);

Vue.directive('autofocus', autofocus);

Vue.config.productionTip = false;
Vue.config.performance = true;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
