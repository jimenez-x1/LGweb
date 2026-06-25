import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const config: AxiosRequestConfig = {
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};

const api = axios.create(config);

export default api;