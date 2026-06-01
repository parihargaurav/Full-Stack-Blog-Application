const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);

export function apiUrl(path = "") {
  if (!path) return API_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export { API_URL };
