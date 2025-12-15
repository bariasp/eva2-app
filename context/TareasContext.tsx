import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  obtenerTareas,
  crearTarea,
  eliminarTarea,
  completarTarea
} from "../services/tareas.service";
import { useAuth } from './AuthContext';

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}


interface TareasContextType {
  tareas: Tarea[];
  loading: boolean;
  fetchTareas: () => Promise<void>;
  agregarTarea: (data: { titulo: string; descripcion?: string }) => Promise<void>;
  eliminarTarea: (id: string) => Promise<void>;
  completarTarea: (id: string) => Promise<void>;
}

const TareasContext = createContext<TareasContextType | undefined>(undefined);

export const TareasProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTareas = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await obtenerTareas(token);
      setTareas(response.data);
    } catch (e) {
      console.log('Error obteniendo tareas', e);
    } finally {
      setLoading(false);
    }
  };

 const agregarTarea = async (data: {
  titulo: string;
  descripcion?: string;
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}) => {
  if (!token) throw new Error('No hay token');

  if (!data.titulo.trim()) {
    throw new Error('Título requerido');
  }

  await crearTarea(token, data);
  await fetchTareas();
};
  const eliminar = async (id: string) => {
    if (!token) return;
    try {
    await eliminarTarea(token, id);
    await fetchTareas();
    } catch (e) {
      throw e;
    }
  };

  const completar = async (id: string) => {
    if (!token) return;
    await completarTarea(token, id, true);
    await fetchTareas();
  };

  return (
    <TareasContext.Provider
      value={{
        tareas,
        loading,
        fetchTareas,
        agregarTarea,
        eliminarTarea: eliminar,
        completarTarea: completar,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};

export const useTareas = () => {
  const ctx = useContext(TareasContext);
  if (!ctx) {
    throw new Error('useTareas debe usarse dentro de TareasProvider');
  }
  return ctx;
};
