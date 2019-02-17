import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: {},
  },
  getters: {
    sessionSet: state => state.editor.sessionList.map(sessionId => state.editor.sessions[sessionId]),
    currentSession: state => state.editor.sessions[state.editor.currentSession],
    currentNodes: state => state.editor.nodes.filter(node => node.sessionId === state.editor.currentSession),
  },
  mutations: {
    initEditorData(state) {
      state.editor = {
        sessions: {},
        sessionList: [],
        nodes: [],
        knownPermissions: [],
        currentSession: null,
        modal: {
          type: null,
          object: null,
        },
        errors: {
          load: false,
        },
      };
    },
    setKnownPermissions(state, array) {
      state.editor.knownPermissions = array;
    },
    addEditorSession(state, session) {
      state.editor.sessions[session.id] = session;
      state.editor.sessionList.push(session.id);
    },
    addEditorNode(state, node) {
      state.editor.nodes.push(node);
    },
    setCurrentSession(state, sessionId) {
      state.editor.currentSession = sessionId;
    },
    setModal(state, { type, object }) {
      state.editor.modal.type = type || null;
      state.editor.modal.object = object || null;
    },
    toggleNodeValue(state, node) {
      node.value = !node.value;
    },
    setLoadError(state) {
      state.editor.errors.load = true;
    },
  },
  actions: {
    getEditorData({ state, commit }, sessionId) {
      commit('initEditorData');
      
      axios.get(`https://bytebin.lucko.me/${sessionId}`)
        .then((response) => {
          response.data.sessions.forEach((session, id) => {
            session.id = id + 1;

            session.nodes.forEach((node, nodeId) => {
              node.id = state.editor.nodes.length + nodeId + 1;
              node.sessionId = session.id;

              commit('addEditorNode', node);
            });

            commit('addEditorSession', { id: session.id, who: session.who });
          });

          commit('setKnownPermissions', response.data.knownPermissions);
        })
        .catch(() => {
          console.error(`Error loading data from bytebin - session ID: ${sessionId}`);
          commit('setLoadError');
        });
    },
    changeCurrentSession({ commit }, session) {
      commit('setCurrentSession', session);
    },
    addNewGroup({ state, commit }, group) {
      const lastSession = state.editor.sessionList.length - 1;


    }
  },
});
