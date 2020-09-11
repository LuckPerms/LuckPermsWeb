import { VuexMultiHistory } from 'vuex-multi-history';

export const editorHistory = new VuexMultiHistory({
  debug: true,
  histories: {
    keys: ['editor'],
    resolve: () => ['editor'],
  },
  filter(mutation) {
    if (!this.store.getters.editorHistoryEnabled) return false;
    const historyTypes = [
      'addEditorNode',
      'addEditorSession',
      'toggleNodeValue',
      'updateNode',
      'updateNodeContext',
      'deleteNode',
      'addTrack',
      'updateTrack',
      'deleteTrack',
      'updateTrackOrder',
      'deleteSession',
      'bulkUpdateNode',
      'addNodeToSession',
    ];
    const result = historyTypes.includes(mutation.type);
    console.log(mutation, result);
    return result;
  },
});
