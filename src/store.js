import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: {
      data: Object,
      currentSession: Object,
    }
  },
  mutations: {
    setEditorData(state, data) {
      state.editor.data = data;
    },
    changeCurrentSession(state, session) {
      state.editor.currentSession = session;
    }
  },
  actions: {
    getEditorData({ commit }, sessionId) {
      axios.get(`https://bytebin.lucko.me/${sessionId}`)
        .then(response => {
          commit('setEditorData', response.data);
        })
    },
  },
});
