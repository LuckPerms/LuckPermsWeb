import store from '../store';

/**
 * Checks the URL for a session ID and updates the app with the new session
 *
 * @param {Object} route
 * @param {('getEditorData'|'getVerboseData'|'getTreeData')} type
 */
export default async function updateSession(route, type) {
  const { params: { id }, query, hash } = route;
  const queryKeys = Object.keys(query);
  let sessionId;

  if (id) {
    sessionId = route.params.id;
  } else if (queryKeys.length > 0) {
    const [queryKey] = queryKeys;
    sessionId = `?${queryKey}`;
  } else if (hash) {
    sessionId = hash;
  }

  if (sessionId) {
    await store.dispatch(type, sessionId);
  }
}
