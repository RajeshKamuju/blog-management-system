const API_BASE = "/api";

export function getAuthToken(): string | null {
  return localStorage.getItem("blogsphere_token");
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("blogsphere_token", token);
  } else {
    localStorage.removeItem("blogsphere_token");
    localStorage.removeItem("blogsphere_user");
  }
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("blogsphere_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: any) {
  if (user) {
    localStorage.setItem("blogsphere_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("blogsphere_user");
  }
}

export function clearAuth() {
  localStorage.removeItem("blogsphere_token");
  localStorage.removeItem("blogsphere_user");
}

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<any> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on ${method} ${endpoint}:`, error.message);
    throw error;
  }
}
