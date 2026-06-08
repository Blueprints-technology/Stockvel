import axios from "axios";
import { authStore } from "@/store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001/api/v1",
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  const csrfToken = authStore.getState().csrfToken;
  config.headers = config.headers ?? {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    if (originalRequest?.url?.includes("/auth/refresh")) {
      authStore.getState().clearSession();
      return Promise.reject(error);
    }

    if (error?.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      refreshPromise ??= api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });

      try {
        const { data } = await refreshPromise;
        authStore.getState().setSession(data);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        originalRequest.headers["x-csrf-token"] = data.csrfToken;
        return api(originalRequest);
      } catch (refreshError) {
        authStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
