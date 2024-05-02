export function saveMe(obj) {
  localStorage.setItem("user", JSON.stringify(obj));
}

export function getMe() {
  return (
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"))
  );
}

export function forgetMe() {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
}

export function saveSessionMe(obj) {
  sessionStorage.setItem("user", JSON.stringify(obj));
}
