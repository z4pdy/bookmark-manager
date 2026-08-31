import { API_URL } from "../config/api";
import { apiFetch } from "./api";

export async function login(login, password) {
  return apiFetch(API_URL + "/auth/login", {
    method: "POST",
    body: JSON.stringify({
      "login": login,
      "password": password
    })
  }, false)
  .then(async res => {
    const data = await res.json();
    saveUser(data)
    return true
  })
}

export async function register(username, email, password) {
  return apiFetch(API_URL + "/auth/register", {
    method: "POST",
    body: JSON.stringify({
      "username": username,
      "email": email,
      "password": password
    })
  }, false)
  .then(() => {
    return true;
  });
}

export function isLoggedIn() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token || !user.username) return false;

  const payload = JSON.parse(atob(user.token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}
