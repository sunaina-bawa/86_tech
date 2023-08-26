import axios from "axios";

const instance = axios.create({
  baseURL: "https://eight6-tech-backend.onrender.com", // Replace with your backend API base URL
});

export default instance;
