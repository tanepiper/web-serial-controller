export function timeString(includeSeconds?: boolean, date = new Date()): string {
    const hour = date.getHours();
    const min = date.getMinutes();
    if (includeSeconds) {
        const seconds = date.getSeconds();
        return [hour < 10 ? `0${hour}` : hour, min < 10 ? `0${min}` : min, seconds < 10 ? `0${seconds}` : seconds].join(':');
    }

    return [hour < 10 ? `0${hour}` : hour, min < 10 ? `0${min}` : min].join(':');
}
