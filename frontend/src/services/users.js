import { API_URL } from "../config/api";
import { getUser } from "./auth";

export async function updateIsPublic(isPublic) {
  const user = getUser();
  if (!user || !user.token) {
    throw new Error("User is not authenticated");
  }

  return fetch(API_URL + "/users/is-public", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.token}`
    },
    body: JSON.stringify({
      "isPublic": isPublic
    })
  })
  .then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }
  });
}
