import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000,
  // Authentication is expected to use secure, HttpOnly cookies set by Flask.
  withCredentials: true,
  headers: { Accept: "application/json", "X-Requested-With": "XmlHttpRequest" },
});

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data) {
    const payload = error.response.data;
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.error === "string") return payload.error;
    if (typeof payload.detail === "string") return payload.detail;
  }
  if (error?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (error?.code === "ERR_NETWORK") return "Cannot reach the IDP server. Check that the Flask backend is running.";
  return fallback;
}

export default api;
