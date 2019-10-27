import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: {},
  },



  getters: {
    sessionSet: state => {
      if (state.editor.sessionList) return state.editor.sessionList.map(sessionId => state.editor.sessions[sessionId]);
    },

    currentSession: state => {
      if (state.editor.sessions) return state.editor.sessions[state.editor.currentSession];
    },

    currentNodes: state => {
      if (state.editor.nodes) return state.editor.nodes.filter(node => node.sessionId === state.editor.currentSession);
    },

    tracks: state => state.editor.tracks,

    selectedNodes: state => state.editor.selectedNodes,

    lastNodeId: state => {
      if (state.editor.nodes && state.editor.nodes.length) {
        return state.editor.nodes.sort((a, b) => a - b)[state.editor.nodes.length - 1].id
      }

      return 0;
    },

    modifiedSessions: (state, getters) => {
      if (getters.sessionSet && getters.sessionSet.length) {
        let newGroups = getters.sessionSet.filter(session => session.new).map(session => session.id);

        let modifiedSessions = state.editor.nodes.filter(node => {
          return node.new || node.modified;
        }).map(node => node.sessionId);

        return new Set(newGroups.concat(newGroups, modifiedSessions));
      }

      return null;
    },

    saveStatus: state => {
      if (state.editor.save) return state.editor.save.status;
    },

    saveKey: state => {
      if (state.editor.save) return state.editor.save.key;
    },
  },



  mutations: {
    initEditorData(state) {
      state.editor = {
        sessions: {},
        sessionList: [],
        nodes: [],
        metaData: {},
        tracks: [],
        knownPermissions: [],
        potentialContexts: [],
        currentSession: null,
        selectedNodes: [],
        modal: {
          type: null,
          object: null,
        },
        errors: {
          load: false,
        },
        save: {
          status: null,
          key: null,
        }
      };
    },

    setMetaData(state, object) {
      state.editor.metaData = object;
    },

    setKnownPermissions(state, array) {
      state.editor.knownPermissions = array;
    },

    setTracks(state, array) {
      state.editor.tracks = array;
    },

    updateTrackOrder(state, value) {
      state.editor.tracks = value;
    },

    setPotentialContexts(state, array) {
      state.editor.potentialContexts = array;
    },

    addEditorSession(state, { id, type, displayName, isNew = false }) {
      state.editor.sessions[id] = {
        id,
        type,
        displayName,
        new: isNew,
      };
      state.editor.sessionList.push(id);
    },

    addEditorNode(state, node) {
      if (node.expiry instanceof Date) node.expiry = node.expiry.getTime() / 1000;

      state.editor.nodes.push(node);
    },

    deleteNode(state, nodeId) {
      state.editor.nodes = state.editor.nodes.filter(node => node.id !== nodeId);
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
      node.modified = true;
    },

    updateNode(state, payload) {
      if (payload.type !== 'expiry') {
        payload.node[payload.type] = payload.data.value;
      } else {
        payload.node[payload.type] = payload.data.value.getTime() / 1000;
      }

      payload.node.modified = true;
    },

    updateNodeContext(state, payload) {
      payload.node.context = payload.data;
      payload.node.modified = true;
    },

    addNodeToSession(state, node) {
      state.editor.nodes.push(node);
    },

    toggleNodeSelect(state, nodeId) {
      if (state.editor.selectedNodes.indexOf(nodeId) >= 0) {
        state.editor.selectedNodes.splice(state.editor.selectedNodes.indexOf(nodeId), 1);
      } else {
        state.editor.selectedNodes.push(nodeId);
      }
    },

    setLoadError(state) {
      state.editor.errors.load = true;
    },

    setSaveStatus(state, status) {
      state.editor.save.status = status;
    },

    setBytebinKey(state, key) {
      state.editor.save.key = key;
    }
  },



  actions: {
    getEditorData({ commit, dispatch }, sessionId) {
      commit('initEditorData');

      axios.get(`https://bytebin.lucko.me/${sessionId}`)
        .then((response) => {
          commit('setMetaData', response.data.metadata);

          response.data.permissionHolders.forEach((session) => {
            session.nodes.forEach((node) => {
              dispatch('addNodes', [{
                sessionId: session.id,
                type: node.type,
                key: node.key,
                value: node.value,
                expiry: node.expiry,
                context: node.context,
              }]);
            });

            commit('addEditorSession', session);
          });

          commit('setKnownPermissions', response.data.knownPermissions);
          commit('setPotentialContexts', response.data.potentialContexts);
          commit('setTracks', response.data.tracks);
        })
        .catch(error => {
          console.error(error);
          console.error(`Error loading data from bytebin - session ID: ${sessionId}`);
          commit('setLoadError');
        });
    },

    addKnownPermission({ commit }, permission) {
      commit('addKnownPermission', permission);
    },

    addNodes({ commit, getters }, nodes) {
      nodes.forEach((node, index) => {
        node.id = getters.lastNodeId + index + 1;
        node.expiry = node.expiry || null;
        node.context = node.context || {};
        commit('addEditorNode', node);
      });

      // props = { sessionId, type, key, value = true, expiry = null, context = {}, isNew = false, modified = false };
      //
      // let node = {
      //   id: getters.lastNodeId + 1,
      //   sessionId,
      //   type,
      //   key,
      //   value,
      //   expiry,
      //   context,
      //   new: isNew,
      //   modified,
      // };
    },

    changeCurrentSession({ commit }, session) {
      commit('setCurrentSession', session);
    },

    addGroup({ commit, dispatch }, group) {

      let session = {
        id: group.name,
        displayName: group.displayName || group.name,
        type: 'group',
        isNew: true,
      };

      if (group.displayName !== '') dispatch('addNodes', [{
        sessionId: session.id,
        type: 'display_name',
        key: 'displayname.' + group.displayName,
        value: true,
        isNew: true,
      }]);

      if (group.parent !== 0) dispatch('addNodes', [{
        sessionId: session.id,
        type: 'inheritance',
        key: 'group.' + group.parent,
        value: true,
        isNew: true,
      }]);

      if (group.weight !== 0) dispatch('addNodes', [{
        sessionId: session.id,
        type: 'weight',
        key: 'weight.' + group.weight,
        value: true,
        isNew: true,
      }]);

      if (group.prefix !== '') dispatch('addNodes', [{
        sessionId: session.id,
        type: 'prefix',
        key: 'prefix.' + group.weight + '.' + group.prefix,
        value: true,
        isNew: true,
      }]);

      if (group.suffix !== '') dispatch('addNodes', [{
        sessionId: session.id,
        type: 'suffix',
        key: 'suffix.' + group.weight + '.' + group.suffix,
        value: true,
        isNew: true,
      }]);

      commit('addEditorSession', session);
      commit('setCurrentSession', session.id);
      commit('setModal', { type: null, object: null });
    },

    saveData({ state, getters, commit }) {
      commit('setSaveStatus', 'saving');

      let changes = [];

      getters.modifiedSessions.forEach(modifiedSession => {
        const session = state.editor.sessions[modifiedSession];
        const sessionNodes = state.editor.nodes.filter(node => node.sessionId === session.id);

        let nodes = [];

        sessionNodes.forEach(node => nodes.push({
          type: node.type,
          key: node.key,
          value: node.value,
          ...node.expiry && { expiry: node.expiry},
          ...(Object.entries(node.context).length) && { context: node.context },
        }));

        changes.push({
          type: session.type,
          id: session.id,
          nodes,
        });
      });

      axios.post('https://bytebin.lucko.me/post', { changes })
        .then(response => {
          commit('setBytebinKey', response.data.key);
          commit('setSaveStatus', 'saved');
          commit('setModal', { type: 'savedChanges', object: getters.saveKey });
        })
        .catch(console.error);
    }
  },
});
