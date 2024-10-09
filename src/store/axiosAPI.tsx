import axios from "axios";
import { getToken } from "./userStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Set your base URL in .env

// Create an Axios instance
const axiosAPI = axios.create({
  baseURL: API_BASE_URL, // Set the base URL
});

// Add a request interceptor to include the Bearer token in headers
axiosAPI.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage or cookies (depending on your auth implementation)
    const token = getToken(); // Example of getting the token from localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the request error
    return Promise.reject(error);
  }
);

export default axiosAPI;
