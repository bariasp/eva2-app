import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest } from '../services/auth.service';

const TOKEN_KEY = '@auth_token';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

const login = async (email: string, password: string) => {
  const response = await loginRequest(email, password);

  console.log('LOGIN RESPONSE FINAL', response);

  const tokenFromApi = response.token;

  if (!tokenFromApi) {
    throw new Error('Token no recibido desde la API');
  }

  await AsyncStorage.setItem(TOKEN_KEY, tokenFromApi);
  setToken(tokenFromApi);
};


  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
