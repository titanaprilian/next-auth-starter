import axios from "axios";
const BASE_URL = "/api/auth";

let accessToken: string | null = null;
let refreshSubscriber: ((token: string) => void) | null = null;

export const setAxiosToken = (token: string | null) => {
  accessToken = token;
};
export const setRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscriber = callback;
};

export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const PlainAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await Axios.post("refresh");
        const newAccessToken = data.data.access_token;

        setAxiosToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return Axios(originalRequest);
      } catch (refreshError: any) {
        setAxiosToken(null);

        // Only force redirect if refresh token itself is invalid
        if (refreshError.response?.status === 401) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
