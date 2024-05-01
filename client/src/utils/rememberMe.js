export function saveMe(obj) {
  localStorage.setItem("user", JSON.stringify(obj));
}

export function getMe() {
  return JSON.parse(localStorage.getItem("user"));
}

export function forgetMe() {
  return localStorage.removeItem("user");
}
