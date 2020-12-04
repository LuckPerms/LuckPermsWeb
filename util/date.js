/**
 * Compares dates and returns the relative
 *
 * @param {number} date - The timestamp being compared
 * @param {number} [baseDate] - The timestamp being compared from (defaults to now)
 * @param {boolean} [includeTime=false] - Whether to include return the time
 * @returns {String}
 */
export function relativeDate(date, baseDate, includeTime) {
  if (!process.browser) return;
  const rtf = new Intl.RelativeTimeFormat(navigator.language, {
    numeric: 'auto',
  });
  const now = baseDate ? baseDate : new Date().getTime();
  const diff = date - now;
  const absDiff = Math.abs(diff);

  let value, unit;

  // Seconds
  if (absDiff < 60000) {
    value = Math.floor(diff / 1000);
    unit = 'second';
  }

  // Minutes
  else if (absDiff >= 60000 && absDiff < 3600000) {
    value = Math.floor(diff / 60000);
    unit = 'minute';
  }

  // Hours
  else if (absDiff >= 3600000 && absDiff < 86400000) {
    value = Math.floor(diff / 3600000);
    unit = 'hour';
  }

  // Days
  else if (absDiff >= 86400000 && absDiff < 604800000) {
    value = Math.floor(diff / 86400000);
    unit = 'day';
  }

  // Weeks
  else if (absDiff >= 604800000 && absDiff < 2629800000) {
    value = Math.floor(diff / 604800000);
    unit = 'week';
  }

  // Months
  else {
    value = Math.floor(diff / 2629800000);
    unit = 'month';
  }

  const dateFormat = rtf.format(value, unit);

  if (includeTime) {
    const dateTime = new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    const timeFormat = dateTime.format(new Date(date));

    return `${dateFormat} @ ${timeFormat}`;
  }

  return dateFormat;
}
