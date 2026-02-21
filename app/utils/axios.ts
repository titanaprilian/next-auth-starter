/**
 * Authentication and axios configuration for the Next.js application.
 * 
 * Key concepts:
 * - accessToken: JWT token stored in memory, sent in Authorization header
 * - refresh_token: HTTP-only cookie, used to obtain new access tokens
 * - localStorage flags: Used to track login/logout state across page navigations
 */

import axios from "axios";

const BASE_URL = "/api/auth";
const LOGOUT_KEY = "auth_logged_out";

const isBrowser = typeof window !== "undefined";

/**
 * Checks if user is in logout state by reading from localStorage.
 * This persists across page navigations to prevent race conditions.
 */
const getLogoutState = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem(LOGOUT_KEY) === "true";
};

/**
 * Sets the logout state in localStorage.
 * Used to persist logout state across page navigations.
 */
const setLogoutState = (value: boolean) => {
  if (!isBrowser) return;
  if (value) {
    localStorage.setItem(LOGOUT_KEY, "true");
  } else {
    localStorage.removeItem(LOGOUT_KEY);
  }
};

// In-memory authentication state (reset on page refresh)
let accessToken: string | null = null;          // JWT access token for API requests
let refreshSubscriber: ((token: string) => void) | null = null;  // Callback for token refresh events
let currentLocale: string = "en";                // Current locale for i18n
let isRefreshing = false;                        // Flag to prevent multiple simultaneous refreshes
let isLoggedOut = getLogoutState();              // Tracks if user has explicitly logged out
// Queue for requests waiting for token refresh to complete
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Processes queued requests after token refresh completes.
 * @param error - If present, rejects all queued requests with this error
 * @param token - If present, resolves all queued requests with the new token
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Forces redirect to login page when refresh token is revoked/invalid.
 * Sets logout state and clears the refresh_token cookie via middleware.
 */
const forceRedirectToLogin = () => {
  if (isLoggedOut) return;
  isLoggedOut = true;
  setLogoutState(true);
  setAxiosToken(null);

  if (isBrowser) {
    window.location.replace("/login?force=true");
  }
};

/**
 * Sets the access token for API requests.
 * Also clears logout state when a valid token is set.
 */
export const setAxiosToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    isLoggedOut = false;
    setLogoutState(false);
  }
};

/**
 * Resets all authentication state.
 * Used during login to clear any previous logout state.
 */
export const resetAuthState = () => {
  isLoggedOut = false;
  isRefreshing = false;
  accessToken = null;
  failedQueue = [];
  setLogoutState(false);
};

/**
 * Clears only the logout state while preserving other state.
 * Used when user session is validated (e.g., /me returns 200).
 */
export const clearLogoutState = () => {
  isLoggedOut = false;
  setLogoutState(false);
};

/**
 * Checks if user has a valid session by looking for refresh_token cookie,
 * access token in memory, OR if user was previously logged in (localStorage).
 * 
 * This is used by AuthProvider and PermissionsProvider to determine whether
 * to fetch user data on app initialization. We check:
 * 1. refresh_token cookie - indicates valid server session
 * 2. accessToken in memory - set after successful login (before cookie available)
 * 3. was_logged_in flag - localStorage flag set after successful login,
 *    used to trigger token refresh on page refresh when cookie not yet available
 * 
 * Returns false if user has explicitly logged out (stored in localStorage).
 * Only works in browser context (returns false on server).
 */
export const hasValidSession = (): boolean => {
  if (!isBrowser) return false;
  
  const logoutState = getLogoutState();
  const cookies = document.cookie;
  const hasCookie = cookies.includes("refresh_token");
  const hasToken = accessToken !== null;
  const wasLoggedIn = localStorage.getItem("was_logged_in") === "true";
  
  // Don't make requests if user has explicitly logged out
  if (logoutState) return false;
  
  // Check for refresh token cookie, access token in memory, OR was previously logged in
  return hasCookie || hasToken || wasLoggedIn;
};

/**
 * Marks that user has logged in successfully.
 * 
 * This is used to persist login state in localStorage so that on page refresh,
 * we can detect that the user was previously logged in and attempt to refresh
 * the access token using the refresh_token cookie.
 * 
 * The flow:
 * 1. User logs in successfully → markWasLoggedIn() sets flag in localStorage
 * 2. Page refreshes → hasValidSession() sees was_logged_in flag, returns true
 * 3. Auth providers make API requests → get 401 because access token expired
 * 4. Axios interceptor catches 401 → refreshes token using cookie
 * 5. If refresh succeeds → requests continue normally
 * 6. If refresh fails → redirect to login
 */
export const markWasLoggedIn = () => {
  if (!isBrowser) return;
  localStorage.setItem("was_logged_in", "true");
};

/**
 * Clears the was_logged_in flag when user logs out.
 * This ensures we don't attempt token refresh after explicit logout.
 */
export const clearWasLoggedIn = () => {
  if (!isBrowser) return;
  localStorage.removeItem("was_logged_in");
};

/**
 * Maps short locale code to full locale format for Accept-Language header.
 * e.g., "id" -> "id-ID", "es" -> "es-ES", "en" -> "en-US"
 */
const mapToFullLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    en: "en-US",
    es: "es-ES",
    id: "id-ID",
  };
  return localeMap[locale] || locale;
};

/**
 * Sets the current locale for API requests.
 * Used to send accept-language header to backend.
 */
export const setApiLocale = (locale: string) => {
  currentLocale = locale;
};

/**
 * Gets the current locale for API requests.
 */
export const getApiLocale = () => currentLocale;

/**
 * Sets a callback to be notified when a new token is received.
 * Used for syncing token across multiple components.
 */
export const setRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscriber = callback;
};

/**
 * Main Axios instance for /api/auth endpoints (login, logout, refresh).
 * Uses baseURL: /api/auth
 * Does NOT include credentials (cookies) by default.
 */
export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios instance for requests that need credentials (cookies).
 * Used specifically for login/logout/refresh endpoints where we need
 * to send the refresh_token cookie to the server.
 * 
 * Key difference from Axios: withCredentials: true
 * This ensures cookies are sent with cross-origin requests.
 */
export const PlainAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Axios instance for /api routes (users, rbac, dashboard, etc.)
 * 
 * Features:
 * - Automatically adds Authorization header with access token
 * - Automatically adds accept-language header for i18n
 * - Handles 401 errors by attempting token refresh
 * - Redirects to login if refresh token is invalid/revoked
 * 
 * Does NOT include credentials by default - uses Bearer token instead.
 */
export const ApiAxios = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiAxiosInterceptor = (axiosInstance: typeof ApiAxios) => {
  /**
   * Request interceptor for ApiAxios
   * - Blocks requests if user has explicitly logged out
   * - Adds Authorization header with access token
   * - Adds accept-language header for i18n
   */
  axiosInstance.interceptors.request.use((config) => {
    const logoutState = getLogoutState();

    if (logoutState || isLoggedOut) {
      return Promise.reject(new Error("Session expired"));
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.headers) {
      config.headers["accept-language"] = mapToFullLocale(currentLocale);
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (isLoggedOut || getLogoutState()) {
        return Promise.reject(error);
      }

      /**
       * Response interceptor - handles 401 errors and token refresh
       * 
       * When a request returns 401 (unauthorized):
       * 1. If already refreshing, queue the request to retry after refresh completes
       * 2. If not refreshing, attempt to refresh the token using the refresh_token cookie
       * 3. If refresh succeeds, retry the original request with new token
       * 4. If refresh fails (401/400), force redirect to login page
       */
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return ApiAxios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Use PlainAxios (withCredentials: true) to send refresh_token cookie
          const { data } = await PlainAxios.post("refresh");
          const newAccessToken = data.data.access_token;

          setAxiosToken(newAccessToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          isRefreshing = false;

          return ApiAxios(originalRequest);
        } catch (refreshError: unknown) {
          processQueue(refreshError, null);
          isRefreshing = false;

          const refreshErrorStatus = (refreshError as { response?: { status: number } })?.response?.status;
          
          // Force redirect to login when refresh fails (401 or 400 means token is invalid/revoked)
          if (refreshErrorStatus === 401 || refreshErrorStatus === 400) {
            forceRedirectToLogin();
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

apiAxiosInterceptor(ApiAxios);

/**
 * Request interceptor:
 * - Blocks requests if user is logged out (except for public endpoints)
 * - Adds Authorization header with access token
 */
Axios.interceptors.request.use((config) => {
  const logoutState = getLogoutState();
  const isPublicEndpoint =
    config.url?.includes("login") || config.url?.includes("register");

  if ((logoutState || isLoggedOut) && !isPublicEndpoint) {
    return Promise.reject(new Error("Session expired"));
  }

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.headers) {
    config.headers["accept-language"] = mapToFullLocale(currentLocale);
  }

  return config;
});

/**
 * Response interceptor:
 * - Handles 401 errors by attempting token refresh
 * - Queues concurrent requests during refresh to prevent duplicate refresh calls
 * - Redirects to login if refresh token is invalid/revoked
 */
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isPublicEndpoint =
      originalRequest.url?.includes("login") ||
      originalRequest.url?.includes("register");

    if ((isLoggedOut || getLogoutState()) && !isPublicEndpoint) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh") &&
      !isPublicEndpoint
    ) {
      // If already refreshing, queue this request to retry after refresh completes
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return Axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await Axios.post("refresh");
        const newAccessToken = data.data.access_token;

        setAxiosToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;

        return Axios(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Refresh token is invalid/revoked - force redirect to login
        if (refreshError.response?.status === 401) {
          forceRedirectToLogin();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
