import { logout, getUser } from "./auth";
 
export async function apiFetch(url, options = {}, authorization = true) {
  options.headers = options.headers || {};

  if (!options.headers["Content-Type"] && options.body) {
    options.headers["Content-Type"]  = "application/json"
  }

  if (authorization) {
    const user = getUser();
    if (!user || !user.token) {
      throw new Error("User is not authenticated");
    }
    options.headers.Authorization = `Bearer ${user.token}`;
  }

  return fetch(url, options)
  .then(async res => {
    if (authorization && res.status === 401) {
      logout();
      throw new Error("UNAUTHORIZED");
    }
    if (!res.ok) {
      const resError = await res.json();
      const error = new Error()
      error.message = resError.message;
      error.status = res.status;
      throw error
    }
    return res;
  })
  .catch((err) => {
    if (err instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }
    throw err;
  })
}
