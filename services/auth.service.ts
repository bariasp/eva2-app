import { apiFetch } from './api';

export interface LoginResult {
  token: string;
}

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResult> {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = response.data?.data?.token;

  if (!token) {
    throw new Error('Token no recibido desde la API');
  }

  return { token };
}
