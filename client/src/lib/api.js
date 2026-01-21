import axios from "axios";

function buildBaseURL() {
  const raw = (import.meta.env.VITE_API_URL || "http://localhost:5000").trim();

  // hiq "/" në fund nëse ekziston
  const noTrailing = raw.endsWith("/") ? raw.slice(0, -1) : raw;

  // nëse user e ka shkruar me /api, e lëmë; përndryshe e shtojmë
  if (noTrailing.endsWith("/api")) return noTrailing;
  return `${noTrailing}/api`;
}

const api = axios.create({
  baseURL: buildBaseURL(), // p.sh. http://localhost:5000/api
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("autoMeon_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
