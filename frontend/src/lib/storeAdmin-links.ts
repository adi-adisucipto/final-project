import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const errorData = error.response.data;

      const message =
        errorData?.error ||
        errorData?.message ||
        error.message ||
        "Request failed";

      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - Token expired or invalid");
          break;
        case 403:
          console.error("Forbidden - No permission");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
      }
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error("No response from server"));
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return axiosInstance.get<T, T>(url, config);
  },

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return axiosInstance.post<T, T>(url, data, config);
  },

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return axiosInstance.put<T, T>(url, data, config);
  },

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
    return axiosInstance.patch<T, T>(url, data, config);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return axiosInstance.delete<T, T>(url, config);
  },
};