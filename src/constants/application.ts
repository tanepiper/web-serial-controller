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
  DISCONNECTED: 'disconnected',
  AWAITING_PORT: 'awaiting_port',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  USER_CANCELLED: 'user_cancelled',
  ERROR: 'error',
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];
