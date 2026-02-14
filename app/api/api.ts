export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
    ME: `${API_URL}/auth/me`,
    REFRESH: `${API_URL}/auth/refresh`,
    LOGOUT_ALL: `${API_URL}/auth/logout/all`,
  },
};
