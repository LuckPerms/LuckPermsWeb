import { createUnhead, headSymbol } from '@unhead/vue';
import { createApp } from 'vue';

import App from '@/App.vue';
import i18n from '@/util/language';
import FontAwesome from '@/util/icons';
import router from '@/router';
import store from '@/store';

import '@/styles/main.css';

const head = createUnhead();

const headPlugin = {
  install(app) {
    app.config.globalProperties.$head = head;
    app.config.globalProperties.$unhead = head;
    app.provide(headSymbol, head);
  },
};

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(headPlugin)
  .use(FontAwesome)
  .mount('#app');
