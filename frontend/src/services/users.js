import { API_URL } from "../config/api";
import { apiFetch } from "./api"

export async function updateIsPublic(isPublic) {
  return apiFetch(API_URL + "/users/is-public", {
    method: "PATCH",
    body: JSON.stringify({
      "isPublic": isPublic
    })
  })
}
