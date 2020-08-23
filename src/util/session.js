import store from '../store';

/**
 * Checks the URL for a session ID and updates the app with the new session
 *
 * @param {Object} route
 * @param {('getEditorData'|'getVerboseData'|'getTreeData')} type
 */
export default function updateSession(route, type) {
  let sessionId;

  if (route.params.id) {
    sessionId = route.params.id;
  } else if (route.query.id) {
    sessionId = route.query.id;
  } else if (route.hash) {
    // eslint-disable-next-line prefer-destructuring
    sessionId = route.hash.split('#')[1];
  }
  if (sessionId) {
    store.dispatch(type, sessionId);
  }
}
