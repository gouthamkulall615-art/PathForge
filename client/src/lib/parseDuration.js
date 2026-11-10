/**
 * Parses curriculum phase duration strings into numerical weeks and baseline study hours.
 * Supports formats: "4-6 weeks", "3–5 weeks", "3 weeks", "2-3 months", "1 month", "ongoing".
 *
 * Uses an assumed 8 hours/week baseline for standard pace.
 *
 * @param {string|null|undefined} durationStr
 * @returns {{ weeks: number, baseHours: number }}
 */
export function parseDuration(durationStr) {
  const BASE_HOURS_PER_WEEK = 8

  if (!durationStr || typeof durationStr !== 'string') {
    return { weeks: 4, baseHours: 4 * BASE_HOURS_PER_WEEK }
  }

  const normalized = durationStr
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, '-') // en-dash and em-dash to hyphen
    .trim()

  if (normalized.includes('ongoing')) {
    // Standard baseline for capstone / continuous learning phases
    return { weeks: 4, baseHours: 4 * BASE_HOURS_PER_WEEK }
  }

  // Check for month-based durations: e.g. "2-3 months", "1 month"
  const monthRangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*month/)
  if (monthRangeMatch) {
    const min = parseFloat(monthRangeMatch[1])
    const max = parseFloat(monthRangeMatch[2])
    const midpointMonths = (min + max) / 2
    const weeks = Math.max(1, Math.round(midpointMonths * 4.33))
    return { weeks, baseHours: weeks * BASE_HOURS_PER_WEEK }
  }

  const singleMonthMatch = normalized.match(/(\d+(?:\.\d+)?)\s*month/)
  if (singleMonthMatch) {
    const months = parseFloat(singleMonthMatch[1])
    const weeks = Math.max(1, Math.round(months * 4.33))
    return { weeks, baseHours: weeks * BASE_HOURS_PER_WEEK }
  }

  // Check for week-based durations: e.g. "4-6 weeks", "3 weeks"
  const weekRangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*week/)
  if (weekRangeMatch) {
    const min = parseFloat(weekRangeMatch[1])
    const max = parseFloat(weekRangeMatch[2])
    const weeks = Math.max(1, Math.round((min + max) / 2))
    return { weeks, baseHours: weeks * BASE_HOURS_PER_WEEK }
  }

  const singleWeekMatch = normalized.match(/(\d+(?:\.\d+)?)\s*week/)
  if (singleWeekMatch) {
    const weeks = Math.max(1, Math.round(parseFloat(singleWeekMatch[1])))
    return { weeks, baseHours: weeks * BASE_HOURS_PER_WEEK }
  }

  // Fallback default
  return { weeks: 4, baseHours: 4 * BASE_HOURS_PER_WEEK }
}
