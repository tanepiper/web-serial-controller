export function timeString(date = new Date()): string {
  const hour = date.getHours();
  const min = date.getMinutes();
  return [hour < 10 ? `0${hour}` : hour, min < 10 ? `0${min}` : min].join(':');
}
