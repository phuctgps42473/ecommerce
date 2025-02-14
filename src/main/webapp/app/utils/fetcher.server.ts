import axios from "axios";

export const apiFetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.API_URL,
  timeout: 3000,
});

export default apiFetcher;
