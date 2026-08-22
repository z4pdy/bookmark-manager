import { API_URL } from "../config/api";
import { getUser } from "./auth";

export async function getBookmarks(username) {
  return fetch(`${API_URL}/bookmarks/${username}`).then(async res => {
    if (!res.ok) {
      throw res;
    }
    return res.json()
  })
}

export async function createBookmark(category, title, url) {
  const user = getUser();
  if (!user || !user.token) {
    throw new Error("User is not authenticated");  
  }

  return fetch(`${API_URL}/bookmarks`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.token}`
    },
    body: JSON.stringify({
      "category": category,
      "title": title,
      "url": url
    })
  })
  .then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  });
}

export async function editBookmark(bookmarkId, category, title, url) {
  const user = getUser();
  if (!user || !user.token) {
    throw new Error("User is not authenticated");  
  }

  return fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.token}`
    },
    body: JSON.stringify({
      "category": category,
      "title": title,
      "url": url
    })
  })
  .then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  });
}


export async function deleteBookmark(bookmarkId) {
  const user = getUser();
  if (!user || !user.token) {
    throw new Error("User is not authenticated");  
  }

  return fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${user.token}`
    }
  })
  .then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  });
}
