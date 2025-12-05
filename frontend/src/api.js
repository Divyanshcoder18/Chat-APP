import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // backend base URL
  withCredentials: true, // if you’re using cookies/JWT
});

export default API;