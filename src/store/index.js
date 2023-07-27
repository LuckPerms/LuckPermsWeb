import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import language from './language';
import axiosCompress from '@/util/axios_compress';
import { sendChangesViaSocket, socketConnect } from '@/util/ws';

const uuid = require('uuid/v4');
const config = require('../../config.json');

Vue.use(Vuex);

const persistedState = createPersistedState({
  paths: ['language'],
});

export default new Vuex.Store({
  modules: {
    language,
  },
  plugins: [persistedState],
  state: {
    version: null,
    versionTimestamp: null,
    changeLog: [],
    config: null,
    downloads: {
      bukkit: null,
      'bukkit-legacy': null,
      bungee: null,
      nukkit: null,
      sponge: null,
      velocity: null,
      fabric: null,
      forge: null,
    },
    extensions: {
      'extension-legacy-api': null,
      'extension-default-assignments': null,
    },
    additionalPlugins: {
      extracontexts: null,
    },
    placeholderExpansions: {
      'luckperms-mvdw-hook': null,
      'luckperms-papi-expansion': null,
    },
    discordUserCount: null,
    patreonCount: null,
    editor: {
      sessionId: null,
      socket: null,
      errors: {
        load: false,
        unsupported: false,
      },
    },
    verbose: {
      status: 0,
      sessionId: null,
      metadata: null,
      data: null,
      errors: {
        load: false,
        unsupported: false,
      },
    },
    tree: {
      sessionId: null,
      metadata: null,
      data: null,
      errors: {
        load: false,
        unsupported: false,
      },
    },
  },


  getters: {
    version: state => state.version,

    versionTimestamp: state => state.versionTimestamp,

    changeLog: state => state.changeLog,

    config: state => state.config,

    downloads: state => state.downloads,

    extensions: state => state.extensions,

    additionalPlugins: state => state.additionalPlugins,

    placeholderExpansions: state => state.placeholderExpansions,

    discordUserCount: state => state.discordUserCount,

    patreonCount: state => state.patreonCount,

    editorSessionId: state => state.editor.sessionId,

    verbose: state => state.verbose,

    tree: state => state.tree,

    editorSocket: state => state.editor.socket,

    editorSocketStatus: state => state.editor.socketStatus,

    metaData: state => state.editor.metaData,

    sessionList: state => state.editor.sessionList,

    // eslint-disable-next-line max-len
    sessionSet: state => state.editor.sessionList?.map(sessionId => state.editor.sessions[sessionId]),

    currentSession: state => state.editor.sessions[state.editor.currentSession],

    currentSessionId: state => state.editor.currentSession,

    // eslint-disable-next-line max-len
    currentNodes: state => state.editor.nodes?.filter(node => node.sessionId === state.editor.currentSession),

    allNodes: state => state.editor.nodes,

    tracks: state => state.editor.tracks,

    selectedNodeIds: state => state.editor.selectedNodes,

    // eslint-disable-next-line max-len
    selectedNodes: (state, getters) => getters.selectedNodeIds.map(nodeId => getters.allNodes.find(({ id }) => nodeId === id)),

    potentialContexts: state => state.editor.potentialContexts,

    // eslint-disable-next-line max-len
    modifiedSessions: (state, getters) => getters.sessionSet.filter(session => (session.new || session.modified))
      .map(session => session.id),

    weightNodes: state => state.editor.nodes?.filter(node => node.key.startsWith('weight')),

    saveStatus: state => state.editor.save?.status,

    saveKey: state => state.editor.save?.key,
  },


  mutations: {
    setVersion: (state, version) => {
      state.version = version;
    },

    setVersionTimestamp: (state, versionTimestamp) => {
      state.versionTimestamp = versionTimestamp;
    },

    setChangeLog: (state, changeLog) => {
      state.changeLog = changeLog;
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

    setAdditionalPlugins: (state, additionalPlugins) => {
      state.additionalPlugins = additionalPlugins;
    },

    setPlaceholderExpansions: (state, placeholderExpansions) => {
      state.placeholderExpansions = placeholderExpansions;
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
        socket: state?.editor?.socket,
        socketStatus: state?.editor?.socketStatus,
        sessions: {},
        sessionList: [],
        nodes: [],
        metaData: {},
        tracks: [],
        deletedTracks: [],
        deletedGroups: [],
        deletedUsers: [],
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
          unsupported: false,
        },
        save: {
          status: null,
          key: null,
        },
      };
    },

    setEditorSocket(state, object) {
      state.editor.socket = object;
    },

    setEditorSocketStatus(state, object) {
      state.editor.socketStatus = object;
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

    deleteSession(state, sessionId) {
      const { type } = state.editor.sessions[sessionId];
      const sessionListIndex = state.editor.sessionList.findIndex(group => group === sessionId);

      state.editor.sessionList.splice(sessionListIndex, 1);

      delete state.editor.sessions[sessionId];

      if (type === 'group') {
        state.editor.deletedGroups.push(sessionId);

        state.editor.tracks = state.editor.tracks.map(track => (track.groups.includes(sessionId)
          ? {
            ...track,
            groups: track.groups.filter(group => group !== sessionId),
          }
          : track));
      } else if (type === 'user') {
        state.editor.deletedUsers.push(sessionId);
      }

      if (state.editor.currentSession === sessionId) {
        state.editor.currentSession = null;
      }

      state.editor.nodes = state.editor.nodes.filter(node => node.sessionId !== sessionId);
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

      if (node.expiry instanceof Date) addingNode.expiry = node.expiry.getTime();

      state.editor.nodes.push(addingNode);

      if (node.isNew && state.editor.sessions[node.sessionId]) {
        state.editor.sessions[node.sessionId].modified = true;
      }
    },

    deleteNode(state, nodeId) {
      const deletingNode = state.editor.nodes.find(node => node.id === nodeId);

      if (state.editor.selectedNodes.includes(nodeId)) {
        state.editor.selectedNodes.splice(state.editor.selectedNodes.indexOf(nodeId), 1);
      }

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

    /* eslint-disable no-param-reassign */
    updateNode(state, { node, type, data }) {
      if (type === 'expiry') {
        node[type] = data.value ? data.value.getTime() : null;
      } else {
        if (type === 'sessionId') {
          state.editor.sessions[node.sessionId].modified = true;
        }
        node[type] = data.value;
      }

      node.modified = true;
      state.editor.sessions[node.sessionId].modified = true;
    },

    bulkUpdateNode(state, { node, payload }) {
      const {
        value,
        expiry,
        replace,
        contexts,
      } = payload;

      if (value !== null) {
        node.value = value;
      }

      if (expiry) {
        node.expiry = expiry;
      }

      if (replace) {
        node.context = contexts;
      } else {
        const contextList = { ...node.context, ...contexts };
        Object.keys(contextList).forEach((key) => {
          contextList[key] = [...new Set([...(node.context[key] || []), ...(contexts[key] || [])])];
        });
        Vue.set(node, 'context', contextList);
      }

      node.modified = true;
      state.editor.sessions[node.sessionId].modified = true;
    },

    updateNodeContext(state, { node, data }) {
      node.context = data;
      node.modified = true;
      state.editor.sessions[node.sessionId].modified = true;
    },
    /* eslint-enable no-param-reassign */

    addNodeToSession(state, node) {
      state.editor.nodes.push(node);
    },

    toggleNodeSelect(state, node) {
      if (state.editor.selectedNodes.includes(node.id)) {
        state.editor.selectedNodes.splice(state.editor.selectedNodes.indexOf(node.id), 1);
      } else {
        state.editor.selectedNodes.push(node.id);
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

    setLoadError(state, value = true) {
      state.editor.errors.load = value;
    },

    setUnsupportedError(state, value = true) {
      state.editor.errors.unsupported = value;
    },

    setSaveStatus(state, status) {
      state.editor.save.status = status;
    },

    setBytebinKey(state, key) {
      state.editor.save.key = key;
    },

    setVerboseData(state, { data, status }) {
      state.verbose.status = status;

      if (!data) {
        return;
      }

      if (!data.data) {
        throw new Error('Invalid verbose data');
      }

      state.verbose.data = data.data.map(node => ({
        ...node,
        id: uuid(),
      }));
      state.verbose.metadata = data.metadata;
      state.verbose.sessionId = data.sessionId;
    },

    setVerboseLoadError(state, value = true) {
      state.verbose.errors.load = value;
    },

    setVerboseUnsupportedError(state, value = true) {
      state.verbose.errors.unsupported = value;
    },

    setTreeData(state, data) {
      state.tree.data = data.data;
      state.tree.metadata = data.metadata;
      state.tree.sessionId = data.sessionId;
    },

    setTreeLoadError(state, value = true) {
      state.tree.errors.load = value;
    },

    setTreeUnsupportedError(state, value = true) {
      state.tree.errors.unsupported = value;
    },
  },


  actions: {
    getAppData: async ({ commit, dispatch }) => {
      commit('setConfig', config);
      try {
        const appData = await axios.get(`${config.api_url}/data/all`);
        commit('setVersion', appData.data.version);
        commit('setVersionTimestamp', appData.data.versionTimestamp);
        commit('setChangeLog', appData.data.changeLog);
        commit('setDownloads', appData.data.downloads);
        commit('setExtensions', appData.data.extensions);
        commit('setAdditionalPlugins', appData.data.additionalPlugins);
        commit('setPlaceholderExpansions', appData.data.placeholderExpansions);
        commit('setDiscordUserCount', appData.data.discordUserCount);
        commit('setPatreonCount', appData.data.patreonCount);
      } catch (error) {
        console.error('Error getting data, trying again in 10 seconds...');
        setTimeout(async () => {
          await dispatch('getAppData');
        }, 10000);
      }
    },

    // eslint-disable-next-line object-curly-newline
    async getEditorData({ commit, getters, dispatch }, sessionId) {
      commit('setLoadError', false);
      commit('setUnsupportedError', false);

      if (!sessionId) {
        commit('setLoadError');
        throw new Error('Invalid session ID');
      }

      const previousOpenSession = getters.currentSessionId;
      if (!previousOpenSession) {
        commit('initEditorData', sessionId);
      }

      const [firstChar] = sessionId;

      if (['?', '#'].includes(firstChar)) {
        commit('setUnsupportedError');
        throw new Error('Unsupported version');
      }

      try {
        if (sessionId === 'demo') {
          const { default: data } = await import('../data/editor-demo.json');
          await dispatch('setEditorData', data);
          return;
        }

        const { data } = await axios.get(`${config.bytebin_url}${sessionId}`);

        if (data.socket?.channelId) {
          socketConnect(
            data.socket.channelId,
            sessionId,
            data.socket.publicKey,
            {
              connect: ({ socket }) => {
                commit('setEditorSocket', socket);
                commit('setEditorSocketStatus', true);
              },
              trust: ({ nonce }) => {
                commit('setModal', {
                  type: 'trustPrompt',
                  object: { nonce },
                });
              },
              trusted: () => {
                commit('closeModal');
              },
              reused: () => {
                commit('setModal', {
                  type: 'reusedSessionWarning',
                });
              },
              close: () => {
                commit('setEditorSocketStatus', false);
              },
            },
          ).catch(e => console.log(e));
        }

        if (previousOpenSession) {
          commit('initEditorData', sessionId);
        }

        await dispatch('setEditorData', data, sessionId);

        // restore previous open "window" if exists
        if (previousOpenSession && getters.sessionList.includes(previousOpenSession)) {
          commit('setCurrentSession', previousOpenSession);
        }
      } catch (e) {
        commit('setLoadError');
        console.log(e);
        throw new Error(`Error loading data from bytebin - session ID: ${sessionId}`);
      }
    },

    setEditorData({ commit, dispatch }, data) {
      commit('setMetaData', data.metadata);

      data.permissionHolders.forEach((session) => {
        session.nodes.forEach((node) => {
          const expiry = node.expiry ? node.expiry * 1000 : null;

          dispatch('addNodes', [{
            sessionId: session.id,
            key: node.key,
            value: node.value,
            expiry,
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
        addingNode.expiry = node.expiry;
        addingNode.context = node.context || {};
        addingNode.selected = false;
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
      const { selectedNodes } = getters;

      selectedNodes.forEach((node) => {
        const nodeCopies = [];

        sessions.forEach((sessionId) => {
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

    // eslint-disable-next-line no-unused-vars
    moveNodes({ state, getters, commit }, session) {
      const { selectedNodes } = getters;

      selectedNodes.forEach((node) => {
        commit('updateNode', {
          type: 'sessionId',
          data: {
            value: session,
          },
          node,
        });
      });

      commit('deselectAllSelectedNodes');
      commit('closeModal');
    },

    deleteNodes({ getters, commit }) {
      const selectedNodes = getters.selectedNodeIds.map(node => node);

      selectedNodes.forEach((nodeId) => {
        commit('deleteNode', nodeId);
      });

      commit('closeModal');
    },

    updateNodes({ getters, commit }, payload) {
      const { selectedNodes } = getters;

      selectedNodes.forEach((node) => {
        commit('bulkUpdateNode', { node, payload });
      });
    },

    // eslint-disable-next-line
    saveData({ state, getters, dispatch, commit }) {
      commit('setSaveStatus', 'saving');

      const payload = {
        sessionId: state.editor.sessionId,
        changes: [],
        groupDeletions: state.editor.deletedGroups,
        trackDeletions: state.editor.deletedTracks,
        userDeletions: state.editor.deletedUsers,
      };

      getters.modifiedSessions.forEach((modifiedSession) => {
        const session = state.editor.sessions[modifiedSession];
        const sessionNodes = state.editor.nodes.filter(node => node.sessionId === session.id);

        const nodes = [];

        sessionNodes.forEach(node => nodes.push({
          key: node.key,
          value: node.value,
          ...node.expiry && { expiry: Math.floor(node.expiry / 1000) },
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

      axios.post(`${config.bytebin_url}post`, payload, axiosCompress)
        .then((response) => {
          const { key } = response.data;
          const { socket } = state.editor;

          sendChangesViaSocket(socket, key)
            .then((newSessionId) => {
              commit('setSaveStatus', 'saved');
              dispatch('getEditorData', newSessionId);
            })
            .catch((err) => {
              console.log(err);
              commit('setBytebinKey', key);
              commit('setSaveStatus', 'saved');
              commit('setModal', {
                type: 'savedChanges',
                object: {
                  saveKey: getters.saveKey,
                },
              });
            });
        })
        .catch(console.error);
    },

    async getVerboseData({ commit }, sessionId) {
      commit('setVerboseLoadError', false);
      commit('setVerboseUnsupportedError', false);

      if (!sessionId) {
        commit('setVerboseLoadError');
        throw new Error('Invalid session ID');
      }

      const [firstChar] = sessionId;

      if (['?', '#'].includes(firstChar)) {
        commit('setVerboseUnsupportedError');
        commit('setVerboseData', { data: null, status: 3 });
        throw new Error('Unsupported version');
      }

      try {
        commit('setVerboseData', { data: null, status: 0 });
        if (sessionId === 'demo') {
          commit('setVerboseData', { data: null, status: 1 });
          const { default: data } = await import('../data/verbose-demo.json');
          commit('setVerboseData', { data, status: 2 });
        } else {
          commit('setVerboseData', { data: null, status: 1 });
          const response = await axios.get(`${config.bytebin_url}${sessionId}`);
          const data = {
            ...response.data,
            sessionId,
          };
          commit('setVerboseData', { data, status: 2 });
        }
      } catch (error) {
        console.error(`${error.message} - session ID: ${sessionId}`);
        commit('setVerboseLoadError');
        commit('setVerboseData', { data: null, status: 3 });
        throw new Error('Loading error');
      }
    },

    async getTreeData({ commit }, sessionId) {
      commit('setTreeLoadError', false);
      commit('setTreeUnsupportedError', false);

      if (!sessionId) {
        commit('setTreeLoadError');
        throw new Error('Invalid session ID');
      }

      const [firstChar] = sessionId;

      if (['?', '#'].includes(firstChar)) {
        commit('setTreeUnsupportedError');
        throw new Error('Unsupported version');
      }

      try {
        if (sessionId === 'demo') {
          const { default: data } = await import('../data/tree-demo.json');
          commit('setTreeData', data);
          return;
        }
        const response = await axios.get(`${config.bytebin_url}${sessionId}`);

        const data = {
          ...response.data,
          sessionId,
        };
        commit('setTreeData', data);
      } catch (error) {
        console.error(`${error.message} - session ID: ${sessionId}`);
        commit('setTreeLoadError');
        throw new Error('Loading error');
      }
    },
  },
});
