import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_APP_URL_API,
  headers: {
    "content-type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "X-API-Key": import.meta.env.VITE_APP_API_KEY,
  },
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
