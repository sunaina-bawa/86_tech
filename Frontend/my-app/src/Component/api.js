import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8967", // Replace with your backend API base URL
});

export default instance;
