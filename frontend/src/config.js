const API_URL = (process.env.REACT_APP_API_URL).replace(
  /\/$/,
  "",
);

export function apiUrl(path = "") {
  if (!path) return API_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export function imageUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : apiUrl(path);
}

export { API_URL };
