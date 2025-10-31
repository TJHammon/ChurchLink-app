// src/api.js

const API_URL = import.meta.env.VITE_API_URL;

// Attach token automatically
function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export { apiGet, apiPost };
