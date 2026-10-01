import axios from "axios";
import axiosRetry from "axios-retry";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s between attempts
  retryCondition: (error) => {
    // Retry on network errors (server off, no connection) and 5xx server errors.
    // Do NOT retry 4xx (bad request, not found) — retrying won't fix those.
    return (
      axiosRetry.isNetworkError(error) ||
      (error.response?.status !== undefined && error.response.status >= 500)
    );
  },
});
