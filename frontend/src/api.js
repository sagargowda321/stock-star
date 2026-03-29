import axios from "axios";

// Set base URL to your Flask backend
const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask server
});

export default api;
