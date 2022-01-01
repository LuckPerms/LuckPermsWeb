/**
 * Compares dates and returns the relative
 *
 * @param {number} date - The timestamp being compared
 * @param {string} language - The language in which the date/time should be returned
 * @param {number} [baseDate] - The timestamp being compared from (defaults to now)
 * @param {boolean} [includeTime=false] - Whether to include return the time
 * @returns {String}
 */
// eslint-disable-next-line import/prefer-default-export
export function relativeDate(date, language, baseDate, includeTime) {
  const rtf = new Intl.RelativeTimeFormat(language, {
    numeric: 'auto',
  });
  const now = baseDate || new Date().getTime();
  const diff = date - now;
  const absDiff = Math.abs(diff);

  let value;
  let unit;

  if (absDiff < 60000) {
    // Seconds
    value = Math.floor(diff / 1000);
    unit = 'second';
  } else if (absDiff >= 60000 && absDiff < 3600000) {
    // Minutes
    value = Math.floor(diff / 60000);
    unit = 'minute';
  } else if (absDiff >= 3600000 && absDiff < 86400000) {
    // Hours
    value = Math.floor(diff / 3600000);
    unit = 'hour';
  } else if (absDiff >= 86400000 && absDiff < 604800000) {
    // Days
    value = Math.floor(diff / 86400000);
    unit = 'day';
  } else if (absDiff >= 604800000 && absDiff < 2629800000) {
    // Weeks
    value = Math.floor(diff / 604800000);
    unit = 'week';
  } else {
    // Months
    value = Math.floor(diff / 2629800000);
    unit = 'month';
  }

  const dateFormat = rtf.format(value, unit);

  if (includeTime) {
    const dateTime = new Intl.DateTimeFormat(language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    const timeFormat = dateTime.format(new Date(date));

    return `${dateFormat} @ ${timeFormat}`;
  }

  return dateFormat;
}
