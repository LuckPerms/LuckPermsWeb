/**
 * Parses version numbers into an array of numbers [major, minor, patch]
 *
 * @param {string} version
 * @returns {Array}
 */
function parseVersion(version) {
  const array = version.split('.');

  array.forEach((int, index) => {
    array[index] = parseInt(int, 0);
  });

  return array;
}

function compare(required, actual) {
  if (required > actual) {
    return 1;
  }
  if (required < actual) {
    return -1;
  }
  return 0;
}

/**
 * Check whether the user has at least the version that is required
 *
 * @param {string} required - the version to check against
 * @param {string} current - the user's current version
 * @returns {boolean}
 */
export function checkVersion(required, current) {
  const requiredVersion = parseVersion(required);
  const currentVersion = parseVersion(current);

  let cmp = compare(requiredVersion[0], currentVersion[0]);
  if (cmp != 0) return cmp === 1;

  cmp = compare(requiredVersion[1], currentVersion[1]);
  if (cmp != 0) return cmp === 1;

  cmp = compare(requiredVersion[2], currentVersion[2]);
  return cmp !== -1;
}
