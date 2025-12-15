import { apiFetch } from "./api";

export const obtenerTareas = (token: string) => {
  return apiFetch("/tasks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const crearTarea = (
  token: string,
  data: {
    titulo: string;
    descripcion?: string;
    imagen?: string;
    ubicacion?: {
      latitud: number;
      longitud: number;
    };
  }
) => {
  return apiFetch('/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
export const eliminarTarea = (token: string, id: string) => {
  return apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const completarTarea = (token: string, id: string, completed?: boolean) => {
  const body =
    typeof completed === 'boolean' ? JSON.stringify({ completed }) : undefined;

  return apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body } : {}),
  });
};
