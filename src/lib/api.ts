import axios from "axios";
import { toast } from "sonner";

/**
 * Custom Axios instance for API interactions
 * - Automatically prepends /api to all requests
 * - Includes withCredentials: true to handle JWT cookies
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Optionally show success toast for mutations (POST, PUT, DELETE)
    // if the response contains a success message.
    if (
      response.config.method !== "get" &&
      response.data?.success &&
      response.data?.message
    ) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    console.error("API call failed:", message);

    const isGetRequest = error.config?.method === 'get';

    if (!isGetRequest) {
      // Show error toast for all other errors, including 401 on POST (like login)
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
