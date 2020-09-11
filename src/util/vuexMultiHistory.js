import { VuexMultiHistory } from 'vuex-multi-history';

export const editorHistory = new VuexMultiHistory({
  debug: true,
  filter({ type }) {
    if (!this.store.getters.editorHistoryEnabled) return false;
    console.log(type);
    const historyTypes = [
      'addEditorNode',
      'addEditorSession'
    ];
    return historyTypes.includes(type);
  },
});
