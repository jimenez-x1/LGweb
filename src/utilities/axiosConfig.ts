import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

const api = axios.create(config);

export default api;