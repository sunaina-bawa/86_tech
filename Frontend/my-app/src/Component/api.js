import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8999", // Replace with your backend API base URL
});

export default instance;
