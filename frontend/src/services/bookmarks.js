import { API_URL } from "../config/api";
import { getUser, logout } from "./auth";
import { apiFetch } from "./api"

export async function getBookmarks(username) {
  const user = getUser();
  let headers = {};
  let authorization = false
  if (user && user.token) {
    authorization = true
  }

  return apiFetch(`${API_URL}/bookmarks/${username}`, {
    headers: headers
  }, authorization)
  .then(res => {
    return res.json()
  })
}

export async function createBookmark(category, title, url) {
  return apiFetch(`${API_URL}/bookmarks`, {
    method: "POST",
    body: JSON.stringify({
      "category": category,
      "title": title,
      "url": url
    })
  })
}

export async function editBookmark(bookmarkId, category, title, url) {
  return apiFetch(`${API_URL}/bookmarks/${bookmarkId}`, {
    method: "PUT",
    body: JSON.stringify({
      "category": category,
      "title": title,
      "url": url
    })
  })
}


export async function deleteBookmark(bookmarkId) {
  return apiFetch(`${API_URL}/bookmarks/${bookmarkId}`, {
    method: "DELETE",
  })
}
