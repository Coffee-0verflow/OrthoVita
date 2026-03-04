const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let token = sessionStorage.getItem('token');
let user = JSON.parse(sessionStorage.getItem('user') || 'null');

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export async function signup(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Signup failed');
  }
  
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  token = data.token;
  user = data.user;
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
  return data;
}

export async function verifyAuth() {
  if (!token) return null;
  
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: getHeaders() });
    if (!res.ok) {
      logout();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    logout();
    return null;
  }
}

export function logout() {
  token = null;
  user = null;
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

export function getUser() {
  return user;
}

export function isAuthenticated() {
  return !!token;
}

export async function createSession(sessionData) {
  const res = await fetch(`${API_URL}/api/sessions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(sessionData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create session');
  }
  return res.json();
}

export async function getSessions() {
  const res = await fetch(`${API_URL}/api/sessions`, { headers: getHeaders() });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to get sessions');
  }
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${API_URL}/api/profile`, { headers: getHeaders() });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to get profile');
  }
  return res.json();
}

export async function updateProfile(profileData) {
  const res = await fetch(`${API_URL}/api/profile`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  return res.json();
}
