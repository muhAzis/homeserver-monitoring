import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "Internal server error.";

    if (error.response) {
      errorMessage = error.response.data?.error || `Error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "Cannot connect to server. Please check your connection.";
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;