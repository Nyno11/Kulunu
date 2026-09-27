// Event `date` columns come back from the API as full ISO timestamps
// (e.g. "2026-10-27T23:00:00.000Z") even though they only ever represent a
// calendar date — the embedded time is a timezone-conversion artifact, not
// real data. Reading it back in UTC avoids that artifact shifting the
// displayed day depending on the viewer's local timezone.
export function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

// Events store a separate `time` field as 24-hour "HH:MM" — render it as 12-hour AM/PM.
export function formatEventTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = String(timeStr).split(':').map(Number);
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m || 0).padStart(2, '0')} ${period}`;
}
