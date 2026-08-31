import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "development" 
    ? "http://localhost:3000" 
    : "https://studybuddy-backend-zmy9.onrender.com");

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;