export const Messages = {
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'Access denied. You do not have the required permissions.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred.',
  BAD_REQUEST: 'Invalid request data.',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later.',
  
  AUTH: {
    MISSING_TOKEN: 'Authentication token is missing.',
    INVALID_TOKEN: 'Authentication token is invalid or expired.',
  },

  USER: {
    NOT_FOUND: 'User profile not found.',
    SYNC_SUCCESS: 'User profile synced successfully.',
    UPDATE_SUCCESS: 'User profile updated successfully.',
  },

  CONTENT: {
    NOT_FOUND: 'Content not found.',
    CREATE_SUCCESS: 'AI Content generated and saved successfully.',
    UPDATE_SUCCESS: 'Content updated successfully.',
    DELETE_SUCCESS: 'Content deleted successfully.',
    FETCH_SUCCESS: 'Content fetched successfully.',
  },

  CHAT: {
    SESSION_NOT_FOUND: 'Chat session not found.',
    SESSION_CREATE_SUCCESS: 'Chat session created successfully.',
    MESSAGE_SEND_SUCCESS: 'Message sent and processed successfully.',
    FETCH_SUCCESS: 'Chat history retrieved successfully.',
  },
};
