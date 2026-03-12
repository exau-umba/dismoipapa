import { getJson, postJson } from './client';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  shipping_address?: string;
  is_subscriber: boolean;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  shipping_address: string;
  is_subscriber: boolean;
}) {
  // POST /api/users/register/
  return postJson<UserProfile>('/api/users/register/', payload);
}

export async function loginUser(email: string, password: string) {
  // POST /api/users/login/
  const data = await postJson<AuthTokens>('/api/users/login/', {
    email,
    password,
  });

  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);

  return data;
}

export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Aucun token de rafraîchissement disponible');
  }

  const data = await postJson<{ access: string }>('/api/users/token/refresh/', {
    refresh: refreshToken,
  });

  localStorage.setItem('accessToken', data.access);
  return data.access;
}

export async function getCurrentUser() {
  // GET /api/users/me/
  return getJson<UserProfile>('/api/users/me/');
}

export async function requestPasswordReset(email: string) {
  // POST /api/users/password-reset/
  return postJson('/api/users/password-reset/', { email });
}

export async function activateAccount(token: string) {
  // GET /api/users/activate/?token=...
  return getJson<{ detail?: string }>('/api/users/activate/?token=' + encodeURIComponent(token));
}


