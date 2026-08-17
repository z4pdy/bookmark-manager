export async function login(login, password) {
  return fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      "login": login,
      "password": password
    })
  }).then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message); 
    }
    return res.json()
  }).then((data) => {
    localStorage.setItem("user", JSON.stringify(data));
    window.location.reload();
  })
}

export function isLoggedIn() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token || !user.username) return false;

  const payload = JSON.parse(atob(user.token.split(".")[1]));
  return payload.exp * 1000 > Date.now();
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}
