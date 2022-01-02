import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import en from '../messages/en.json';

Vue.use(VueI18n);

store.dispatch('fetchLanguages');

const i18n = new VueI18n({
  messages: {
    en,
  },
  locale: 'en',
  fallbackLocale: 'en',
});

export default i18n;
