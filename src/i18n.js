import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './messages/en';
import zh_cn from './messages/zh_CN';

Vue.use(VueI18n);

const userLanguage = (navigator.language || navigator.browserLanguage).toLowerCase().replace('-', '_');

export default new VueI18n({
  messages: {
    en,
    zh_cn,
  },
  locale: userLanguage,
  fallbackLocale: 'en',
});
