import { api } from './api';

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function signup(payload: { email: string; password: string; displayName: string }) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}
