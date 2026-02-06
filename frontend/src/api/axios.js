import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3100/api",
  withCredentials: true,
});

console.log("Axios instance created with baseURL:", instance.defaults.baseURL);

export default instance;
