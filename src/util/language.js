import { createI18n } from 'vue-i18n';

import store from '@/store';
import en from '../messages/en.json';

store.dispatch('fetchLanguages');

export default createI18n({
  legacy: true,
  messages: {
    en,
  },
  locale: 'en',
  fallbackLocale: 'en',
});
