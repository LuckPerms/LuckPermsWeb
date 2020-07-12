import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { compareVersions } from './util/version';

const uuid = require('uuid/v4');
const config = require('../config');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    version: null,
    config: null,
    downloads: {
      bukkit: null,
      'bukkit-legacy': null,
      bungee: null,
      nukkit: null,
      sponge: null,
      velocity: null,
    },
    extensions: {
      'extension-legacy-api': null,
      'extension-default-assignments': null,
    },
    discordUserCount: null,
    patreonCount: null,
    editor: {
      sessionId: null,
    },
    verbose: {
      status: 0,
      sessionId: null,
      metadata: null,
      data: null,
      errors: {
        load: false,
      },
    },
    tree: {
      sessionId: null,
      metadata: null,
      data: null,
      errors: {
        load: false,
      },
    },
  },


  getters: {
    version: state => state.version,

    config: state => state.config,

    downloads: state => state.downloads,

    extensions: state => state.extensions,

    discordUserCount: state => state.discordUserCount,

    patreonCount: state => state.patreonCount,

    editorSessionId: state => state.editor.sessionId,

    verbose: state => state.verbose,

    tree: state => state.tree,

    metaData: state => state.editor.metaData,

    // eslint-disable-next-line max-len
    sessionSet: state => state.editor.sessionList?.map(sessionId => state.editor.sessions[sessionId]),

    currentSession: state => state.editor.sessions[state.editor.currentSession],

    // eslint-disable-next-line max-len
    currentNodes: state => state.editor.nodes?.filter(node => node.sessionId === state.editor.currentSession),

    allNodes: state => state.editor.nodes,

    tracks: state => state.editor.tracks,

    selectedNodes: state => state.editor.selectedNodes,

    potentialContexts: state => state.editor.potentialContexts,

    // eslint-disable-next-line max-len
    modifiedSessions: (state, getters) => getters.sessionSet.filter(session => (session.new || session.modified))
      .map(session => session.id),

    weightNodes: state => state.editor.nodes?.filter(node => node.key.startsWith('weight')),

    saveStatus: state => state.editor.save?.status,

    saveKey: state => state.editor.save?.key,

    editorVersionStatus: (state) => {
      if (!state.version || !state.editor.metaData?.pluginVersion) return null;

      return compareVersions(state.version, state.editor.metaData.pluginVersion);
    }
  },


  mutations: {
    setVersion: (state, version) => {
      state.version = version;
    },

    setConfig: (state, configData) => {
      state.config = configData;
    },

    setDownloads: (state, downloads) => {
      state.downloads = downloads;
    },

    setExtensions: (state, extensions) => {
      state.extensions = extensions;
    },

    setDiscordUserCount: (state, discordUserCount) => {
      state.discordUserCount = discordUserCount;
    },

    setPatreonCount: (state, patreonCount) => {
      state.patreonCount = patreonCount;
    },

    initEditorData(state, sessionId) {
      state.editor = {
        sessionId,
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
      const updatedTrack = state.editor.tracks.find(track => track.id === id);

      updatedTrack.groups = newTrack.groups;
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

    setPotentialContexts(state, contexts) {
      const potentialContexts = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(contexts)) {
        potentialContexts.push({
          key,
          values: Array.isArray(value) ? value : [value],
        });
      }

      state.editor.potentialContexts = potentialContexts;
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

      const { deletedGroups } = state.editor;

      if (deletedGroups.includes(id)) {
        deletedGroups.splice(deletedGroups.findIndex(groupId => groupId === id), 1);
      }
    },

    addEditorNode(state, node) {
      const addingNode = node;

      if (node.expiry instanceof Date) addingNode.expiry = node.expiry.getTime() / 1000;

      state.editor.nodes.push(addingNode);

      if (node.isNew && state.editor.sessions[node.sessionId]) {
        state.editor.sessions[node.sessionId].modified = true;
      }
    },

    deleteNode(state, nodeId) {
      const deletingNode = state.editor.nodes.find(node => node.id === nodeId);

      state.editor.nodes = state.editor.nodes.filter(node => node.id !== nodeId);

      state.editor.sessions[deletingNode.sessionId].modified = true;
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
      const updatedNode = payload;

      if (payload.type !== 'expiry') {
        updatedNode.node[payload.type] = payload.data.value;
      } else {
        updatedNode.node[payload.type] = payload.data.value ? payload.data.value.getTime() / 1000 : null;
      }

      updatedNode.node.modified = true;
      state.editor.sessions[payload.node.sessionId].modified = true;
    },

    updateNodeContext(state, payload) {
      const updatedNode = payload;

      updatedNode.node.context = payload.data;
      updatedNode.node.modified = true;
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

    deselectAllSelectedNodes(state) {
      state.editor.selectedNodes.splice(0, state.editor.selectedNodes.length);
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

    setVerboseData(state, { data, status }) {
      state.verbose.status = status;
      if (!data) return;
      state.verbose.data = data.data;
      state.verbose.metadata = data.metadata;
      state.verbose.sessionId = data.sessionId;
    },

    setVerboseLoadError(state) {
      state.verbose.errors.load = true;
    },

    setTreeData(state, data) {
      state.tree.data = data.data;
      state.tree.metadata = data.metadata;
      state.tree.sessionId = data.sessionId;
    },

    setTreeLoadError(state) {
      state.tree.errors.load = true;
    },
  },


  actions: {
    getAppData: async ({ commit, dispatch }) => {
      commit('setConfig', config);
      try {
        const appData = await axios.get(`${config.api_url}/data/all`);
        commit('setVersion', appData.data.version);
        commit('setDownloads', appData.data.downloads);
        commit('setExtensions', appData.data.extensions);
        commit('setDiscordUserCount', appData.data.discordUserCount);
        commit('setPatreonCount', appData.data.patreonCount);
      } catch (error) {
        console.error('Error getting data, trying again in 10 seconds...');
        setTimeout(async () => {
          await dispatch('getAppData');
        }, 10000);
      }
    },

    getEditorData({ commit, dispatch }, sessionId) {
      commit('initEditorData', sessionId);

      if (sessionId === 'demo') {
        import('./data/editor-demo.json').then((json) => {
          dispatch('setEditorData', json.default);
        });
      } else {
        axios.get(`${config.bytebin_url}${sessionId}`)
          .then((response) => {
            const { data } = response;
            dispatch('setEditorData', data, sessionId);
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

      data.permissionHolders.forEach((session) => {
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

    addNodes({ commit }, nodes) {
      nodes.forEach((node) => {
        const addingNode = node;
        addingNode.id = uuid();
        addingNode.expiry = node.expiry || null;
        addingNode.context = node.context || {};
        commit('addEditorNode', addingNode);
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

    copyNodes({ getters, dispatch, commit }, sessions) {
      const selectedNodeIDs = getters.selectedNodes;
      const selectedNodes = [];

      selectedNodeIDs.forEach(nodeId => {
        const node = getters.allNodes.find(n => n.id === nodeId);
        selectedNodes.push(node);
      });

      selectedNodes.forEach(node => {
        const nodeCopies = [];

        sessions.forEach(sessionId => {
          nodeCopies.push({
            ...node,
            sessionId,
            isNew: true,
          });
        });

        dispatch('addNodes', nodeCopies);
      });

      commit('closeModal');
      commit('deselectAllSelectedNodes');
    },

    moveNodes({ getters, commit }, session) {
      const selectedNodeIDs = getters.selectedNodes;
      const selectedNodes = [];

      selectedNodeIDs.forEach(nodeId => {
        const node = getters.allNodes.find(n => n.id === nodeId);
        selectedNodes.push(node);
      });

      selectedNodes.forEach(node => {
        commit('updateNode', {
          type: 'sessionId',
          data: {
            value: session,
          },
          node
        });
      });

      commit('deselectAllSelectedNodes');
      commit('closeModal');
    },

    deleteNodes({ getters, commit }) {
      const selectedNodeIDs = getters.selectedNodes;

      selectedNodeIDs.forEach(nodeId => {
        commit('deleteNode', nodeId);
      });

      commit('deselectAllSelectedNodes');
      commit('closeModal');
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

      getters.tracks.forEach((track) => {
        payload.changes.push({
          type: 'track',
          id: track.id,
          groups: track.groups,
        });
      });

      axios.post(`${config.bytebin_url}post`, payload)
        .then((response) => {
          commit('setBytebinKey', response.data.key);
          commit('setSaveStatus', 'saved');
          commit('setModal', { type: 'savedChanges', object: getters.saveKey });
        })
        .catch(console.error);
    },

    getVerboseData({ commit }, sessionId) {
      commit('setVerboseData', { data: null, status: 0 });
      if (sessionId === 'demo') {
        commit('setVerboseData', { data: null, status: 1 });
        import('./data/verbose-demo.json').then((json) => {
          commit('setVerboseData', { data: json.default, status: 2 });
        });
      } else {
        commit('setVerboseData', { data: null, status: 1 });
        axios.get(`${config.bytebin_url}${sessionId}`)
          .then((response) => {
            const data = {
              ...response.data,
              sessionId,
            };
            commit('setVerboseData', { data, status: 2 });
          })
          .catch(() => {
            console.error(`Error loading data from bytebin - session ID: ${sessionId}`);
            commit('setVerboseLoadError');
            commit('setVerboseData', { data: null, status: 3 });
          });
      }
    },

    getTreeData({ commit }, sessionId) {
      if (sessionId === 'demo') {
        import('./data/tree-demo.json').then((json) => {
          commit('setTreeData', json.default);
        });
      } else {
        axios.get(`${config.bytebin_url}${sessionId}`)
          .then((response) => {
            const data = {
              ...response.data,
              sessionId,
            };
            commit('setTreeData', data);
          })
          .catch((error) => {
            console.error(error);
            console.error(`Error loading data from bytebin - session ID: ${sessionId}`);
            commit('setTreeLoadError');
          });
      }
    },
  },
});
