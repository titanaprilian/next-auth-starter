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

let accessToken: string | null = null;
let refreshSubscriber: ((token: string) => void) | null = null;
let currentLocale: string = "en";
let isRefreshing = false;
let isLoggedOut = getLogoutState();
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

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
 * Main Axios instance for authenticated API requests.
 */
export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios instance for requests that need credentials (cookies).
 * Used for login/logout/refresh endpoints.
 */
export const PlainAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Axios instance for /api routes (users, rbac, etc.)
 * Includes token refresh logic and auto-attaches Bearer token.
 */
export const ApiAxios = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const apiAxiosInterceptor = (axiosInstance: typeof ApiAxios) => {
  axiosInstance.interceptors.request.use((config) => {
    const logoutState = getLogoutState();

    if (logoutState || isLoggedOut) {
      return Promise.reject(new Error("Session expired"));
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.headers) {
      config.headers["accept-language"] = currentLocale;
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

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
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
          const { data } = await Axios.post("refresh");
          const newAccessToken = data.data.access_token;

          setAxiosToken(newAccessToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          isRefreshing = false;

          return ApiAxios(originalRequest);
        } catch (refreshError: unknown) {
          processQueue(refreshError, null);
          isRefreshing = false;

          if ((refreshError as { response?: { status: number } })?.response?.status === 401) {
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
  const isPublicEndpoint = config.url?.includes("login") || config.url?.includes("register");

  if ((logoutState || isLoggedOut) && !isPublicEndpoint) {
    return Promise.reject(new Error("Session expired"));
  }

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (config.headers) {
    config.headers["accept-language"] = currentLocale;
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
      originalRequest.url?.includes("login") || originalRequest.url?.includes("register");

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
