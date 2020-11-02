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

/**
 * Compares the user's version to the latest version
 * Returns an object showing which semver is up to date (major, minor, patch)
 *
 * @param {string} latest - the most up to date version
 * @param {string} current - the user's current version
 * @returns {Object}
 */
export function compareVersions(latest, current) {
  const latestVersion = parseVersion(latest);
  const currentVersion = parseVersion(current);

  return {
    major: latestVersion[0] === currentVersion[0],
    minor: latestVersion[1] === currentVersion[1],
    patch: latestVersion[2] === currentVersion[2],
  };
}

/**
 * Check whether the user has at least the version that is supplied
 *
 * @param {string} version - the version to check against
 * @param {string} current - the user's current version
 * @returns {boolean}
 */
export function checkVersion(version, current) {
  const checkingVersion = parseVersion(version);
  const currentVersion = parseVersion(current);

  return (
    currentVersion[0] >= checkingVersion[0]
    && currentVersion[1] >= checkingVersion[1]
    && currentVersion[2] >= checkingVersion[2]
  );
}
