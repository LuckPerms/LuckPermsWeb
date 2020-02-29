import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

const uuid = require('uuid/v4');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editor: {},
  },


  getters: {
    metaData: (state) => {
      return state.editor.metaData;
    },

    sessionSet: (state) => {
      if (state.editor.sessionList) {
        return state.editor.sessionList.map(sessionId => state.editor.sessions[sessionId]);
      }
    },

    currentSession: (state) => {
      if (state.editor.sessions) return state.editor.sessions[state.editor.currentSession];
    },

    currentNodes: (state) => {
      if (state.editor.nodes) return state.editor.nodes.filter(node => node.sessionId === state.editor.currentSession);
    },

    allNodes: (state) => {
      if (state.editor.nodes) return state.editor.nodes;
    },

    tracks: state => state.editor.tracks,

    selectedNodes: state => state.editor.selectedNodes,

    modifiedSessions: (state, getters) => getters.sessionSet.filter(session => (session.new || session.modified))
      .map(session => session.id),

    weightNodes: (state) => {
      if (state.editor.nodes) return state.editor.nodes.filter(node => node.key.startsWith('weight'));
    },

    saveStatus: (state) => {
      if (state.editor.save) return state.editor.save.status;
    },

    saveKey: (state) => {
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
        deletedTracks: [],
        deletedGroups: [],
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
        },
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

    addTrack(state, track) {
      state.editor.tracks.push(track);
    },

    updateTrack(state, { id, newTrack }) {
      const track = state.editor.tracks.find(track => track.id === id);

      track.groups = newTrack.groups;
    },

    deleteTrack(state, trackId) {
      const index = state.editor.tracks.findIndex(track => track.id === trackId);

      state.editor.tracks.splice(index, 1);
      state.editor.deletedTracks.push(trackId);
    },

    updateTrackOrder(state, value) {
      state.editor.tracks = value;
    },

    deleteGroup(state, groupId) {
      const sessionListIndex = state.editor.sessionList.findIndex(group => group === groupId);

      state.editor.sessionList.splice(sessionListIndex, 1);

      delete state.editor.sessions[groupId];

      state.editor.deletedGroups.push(groupId);

      if (state.editor.currentSession === groupId) {
        state.editor.currentSession = null;
      }

      state.editor.nodes = state.editor.nodes.filter(node => node.sessionId !== groupId);
    },

    setPotentialContexts(state, array) {
      state.editor.potentialContexts = array;
    },

    addEditorSession(state, {
      id, type, displayName, isNew = false,
    }) {
      Vue.set(state.editor.sessions, id, {
        id,
        type,
        displayName,
        new: isNew,
        modified: false,
      });
      // state.editor.sessions[id] = ;
      state.editor.sessionList.push(id);

      const deletedGroups = state.editor.deletedGroups;

      if (deletedGroups.includes(id)) {
        deletedGroups.splice(deletedGroups.findIndex(groupId => groupId === id), 1);
      }
    },

    addEditorNode(state, node) {
      if (node.expiry instanceof Date) node.expiry = node.expiry.getTime() / 1000;

      state.editor.nodes.push(node);

      if (node.isNew && state.editor.sessions[node.sessionId]) state.editor.sessions[node.sessionId].modified = true;
    },

    deleteNode(state, nodeId) {
      const node = state.editor.nodes.find(node => node.id === nodeId);

      state.editor.nodes = state.editor.nodes.filter(node => node.id !== nodeId);

      state.editor.sessions[node.sessionId].modified = true;
    },

    setCurrentSession(state, sessionId) {
      state.editor.currentSession = sessionId;
    },

    setModal(state, { type, object }) {
      state.editor.modal.type = type || null;
      state.editor.modal.object = object || null;
    },

    closeModal(state) {
      state.editor.modal.type = null;
      state.editor.modal.object = null;
    },

    toggleNodeValue(state, node) {
      const nodeState = state.editor.nodes.find(nodeItem => nodeItem.id === node.id);

      nodeState.value = !node.value;
      nodeState.modified = true;

      state.editor.sessions[node.sessionId].modified = true;
    },

    updateNode(state, payload) {
      if (payload.type !== 'expiry') {
        payload.node[payload.type] = payload.data.value;
      } else {
        payload.node[payload.type] = payload.data.value.getTime() / 1000;
      }

      payload.node.modified = true;
      state.editor.sessions[payload.node.sessionId].modified = true;
    },

    updateNodeContext(state, payload) {
      payload.node.context = payload.data;
      payload.node.modified = true;
      state.editor.sessions[payload.node.sessionId].modified = true;
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

    selectAllSessionNodes(state, nodes) {
      nodes.forEach((node) => {
        if (state.editor.selectedNodes.indexOf(node.id) === -1) {
          state.editor.selectedNodes.push(node.id);
        }
      });
    },

    deselectAllSessionNodes(state, nodes) {
      nodes.forEach((node) => {
        if (state.editor.selectedNodes.indexOf(node.id) >= 0) {
          state.editor.selectedNodes.splice(state.editor.selectedNodes.indexOf(node.id), 1);
        }
      });
    },

    addKnownPermission(state, permission) {
      state.editor.knownPermissions.push(permission);
    },

    setLoadError(state) {
      state.editor.errors.load = true;
    },

    setSaveStatus(state, status) {
      state.editor.save.status = status;
    },

    setBytebinKey(state, key) {
      state.editor.save.key = key;
    },
  },


  actions: {
    getEditorData({ commit, dispatch }, sessionId) {
      commit('initEditorData');

      if (sessionId === 'demo') {
        import('./data/editor-demo.json').then(json => {
          dispatch('setEditorData', json.default);
        });
      } else {
        axios.get(`https://bytebin.lucko.me/${sessionId}`)
          .then((response) => {
            const data = response.data;
            dispatch('setEditorData', data);
          })
          .catch((error) => {
            console.error(error);
            console.error(`Error loading data from bytebin - session ID: ${sessionId}`);
            commit('setLoadError');
          });
      }
    },

    setEditorData({ commit, dispatch }, data) {
      commit('setMetaData', data.metadata);

      data.permissionHolders.forEach((session, index) => {
        session.nodes.forEach((node) => {
          dispatch('addNodes', [{
            sessionId: session.id,
            key: node.key,
            value: node.value,
            expiry: node.expiry,
            context: node.context,
          }]);
        });

        commit('addEditorSession', session);
      });

      commit('setKnownPermissions', data.knownPermissions);
      commit('setPotentialContexts', data.potentialContexts);
      commit('setTracks', data.tracks);
    },

    addKnownPermission({ commit }, permission) {
      commit('addKnownPermission', permission);
    },

    addNodes({ commit, getters }, nodes) {
      nodes.forEach(node => {
        node.id = uuid();
        node.expiry = node.expiry || null;
        node.context = node.context || {};
        commit('addEditorNode', node);
      });
    },

    changeCurrentSession({ commit }, session) {
      commit('setCurrentSession', session);
    },

    addGroup({ commit, dispatch }, group) {
      const session = {
        id: group.name,
        displayName: group.displayName || group.name,
        type: 'group',
        isNew: true,
      };

      if (group.displayName !== '') {
        dispatch('addNodes', [{
          sessionId: session.id,
          type: 'display_name',
          key: `displayname.${group.displayName}`,
          value: true,
          isNew: true,
        }]);
      }

      if (group.parent !== 0) {
        dispatch('addNodes', [{
          sessionId: session.id,
          type: 'inheritance',
          key: `group.${group.parent}`,
          value: true,
          isNew: true,
        }]);
      }

      if (group.weight !== 0) {
        dispatch('addNodes', [{
          sessionId: session.id,
          type: 'weight',
          key: `weight.${group.weight}`,
          value: true,
          isNew: true,
        }]);
      }

      if (group.prefix !== '') {
        dispatch('addNodes', [{
          sessionId: session.id,
          type: 'prefix',
          key: `prefix.${group.weight}.${group.prefix}`,
          value: true,
          isNew: true,
        }]);
      }

      if (group.suffix !== '') {
        dispatch('addNodes', [{
          sessionId: session.id,
          type: 'suffix',
          key: `suffix.${group.weight}.${group.suffix}`,
          value: true,
          isNew: true,
        }]);
      }

      commit('addEditorSession', session);
      commit('setCurrentSession', session.id);
      commit('setModal', { type: null, object: null });
    },

    addTrack({ commit }, track) {
      commit('addTrack', track);
      commit('setModal', { type: null, object: null });
    },

    updateTrack({ commit }, { id, newTrack }) {
      if (id === newTrack.id) {
        commit('updateTrack', { id, newTrack });
      } else {
        commit('deleteTrack', id);
        commit('addTrack', newTrack);
      }

      commit('setModal', { type: null, object: null });
    },

    deleteTrack({ commit }, trackId) {
      commit('deleteTrack', trackId);
    },

    saveData({ state, getters, commit }) {
      commit('setSaveStatus', 'saving');

      const payload = {
        changes: [],
        groupDeletions: state.editor.deletedGroups,
        trackDeletions: state.editor.deletedTracks,
      };

      getters.modifiedSessions.forEach((modifiedSession) => {
        const session = state.editor.sessions[modifiedSession];
        const sessionNodes = state.editor.nodes.filter(node => node.sessionId === session.id);

        const nodes = [];

        sessionNodes.forEach(node => nodes.push({
          key: node.key,
          value: node.value,
          ...node.expiry && { expiry: node.expiry },
          ...(Object.entries(node.context).length) && { context: node.context },
        }));

        payload.changes.push({
          type: session.type,
          id: session.id,
          nodes,
        });
      });

      getters.tracks.forEach(track => {
        payload.changes.push({
          type: 'track',
          id: track.id,
          groups: track.groups,
        });
      });

      axios.post('https://bytebin.lucko.me/post', payload)
        .then((response) => {
          commit('setBytebinKey', response.data.key);
          commit('setSaveStatus', 'saved');
          commit('setModal', { type: 'savedChanges', object: getters.saveKey });
        })
        .catch(console.error);
    },
  },
});
