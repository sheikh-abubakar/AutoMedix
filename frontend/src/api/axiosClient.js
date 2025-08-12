import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // will come from frontend .env
  withCredentials: true, // if using cookies for auth
});

export default axiosClient;
