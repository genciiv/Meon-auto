import api from "./api.js";

const TOKEN_KEY = "autoMeon_token";
const USER_KEY = "autoMeon_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// merr user-in nga backend (me token)
export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  if (data?.user) setStoredUser(data.user);
  return data?.user || null;
}
