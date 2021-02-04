/**
 * The available line endings
 */
export const LineEndings = {
  NONE: '',
  NEW_LINE: '\n',
  CARRIAGE_RETURN: '\r',
  BOTH: '\r\n',
} as const;

export type LineEndings = typeof LineEndings[keyof typeof LineEndings];

/**
 * Application Statuses
 */
export const ApplicationStatus = {
  DISCONNECTED: 'Disconnected',
  AWAITING_PORT: 'Awaiting Port',
  CONNECTING: 'Connecting',
  CONNECTED: 'Connected',
  USER_CANCELLED: 'User Cancelled',
  ERROR: 'Error',
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];
