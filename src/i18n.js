import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './messages/en';

Vue.use(VueI18n);

export default new VueI18n({
  messages: {
    en,
  },
  locale: 'en',
  fallbackLocale: 'en',
});
