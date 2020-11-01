/**
 * Compares dates and returns the relative
 *
 * @param {number} date - The timestamp being compared
 * @param {number} [baseDate] - The timestamp being compared from (defaults to now)
 * @returns {String}
 */
export function relativeDate(date, baseDate) {
  const rtf = new Intl.RelativeTimeFormat();
  const now = baseDate ? baseDate : new Date().getTime();
  const diff = date - now;

  let value, unit;

  // Seconds
  if (diff < 60000) {
    value = Math.floor(diff / 1000);
    unit = 'second';
  }

  // Minutes
  else if (diff >= 60000 && diff < 3600000) {
    value = Math.floor(diff / 60000);
    unit = 'minute';
  }

  // Hours
  else if (diff >= 3600000 && diff < 86400000) {
    value = Math.floor(diff / 3600000);
    unit = 'hour';
  }

  // Days
  else if (diff >= 86400000 && diff < 604800000) {
    value = Math.floor(diff / 86400000);
    unit = 'day';
  }

  // Weeks
  else if (diff >= 604800000 && diff < 2629800000) {
    value = Math.floor(diff / 604800000);
    unit = 'week';
  }

  // Months
  else {
    value = Math.floor(diff / 2629800000);
    unit = 'month';
  }

  return rtf.format(value, unit);
}
