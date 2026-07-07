import axios from "axios";

const defaultApiUrl =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || defaultApiUrl,
  withCredentials: true,
});

export default apiClient;
