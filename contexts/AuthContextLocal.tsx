import type { AuthState, Profile } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulación de base de datos local para desarrollo
const LOCAL_STORAGE_KEYS = {
  USERS: '@festech_users',
  CURRENT_USER: '@festech_current_user',
  SESSION: '@festech_session',
};

// Función para generar ID único
const generateId = () => Math.random().toString(36).substr(2, 9);

// Función para simular delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      const storedSession = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.SESSION);
      
      if (storedUser && storedSession) {
        setUser(JSON.parse(storedUser));
        setSession(JSON.parse(storedSession));
      }
    } catch (err) {
      console.error('Error loading stored session:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStoredUsers = async (): Promise<any[]> => {
    try {
      const usersJson = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (err) {
      console.error('Error getting stored users:', err);
      return [];
    }
  };

  const saveUser = async (user: any) => {
    try {
      const users = await getStoredUsers();
      const existingUserIndex = users.findIndex(u => u.email === user.email);
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }
      
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (err) {
      console.error('Error saving user:', err);
      throw new Error('Error al guardar usuario');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await simulateNetworkDelay();
      
      const users = await getStoredUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      if (user.password !== password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Crear perfil simulado
      const profile: Profile = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        phone: user.phone || undefined,
        city: user.city || 'Ibagué',
        avatar_url: undefined,
        bio: undefined,
        interests: user.interests || [],
        date_of_birth: undefined,
        created_at: user.created_at,
      };
      
      // Crear sesión simulada
      const session = {
        access_token: `mock_token_${user.id}`,
        user: {
          id: user.id,
          email: user.email,
        },
        expires_at: Date.now() + 86400000, // 24 horas
      };
      
      setUser(profile);
      setSession(session);
      
      // Guardar en storage
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(session));
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      await simulateNetworkDelay();
      
      const users = await getStoredUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }
      
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }
      
      // Crear usuario local
      const newUser = {
        id: generateId(),
        email,
        password, // En producción, esto debería estar encriptado
        full_name: userData.full_name,
        user_type: userData.user_type,
        interests: userData.interests || [],
        created_at: new Date().toISOString(),
      };
      
      await saveUser(newUser);
      
      // Crear perfil
      const profile: Profile = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        user_type: newUser.user_type,
        phone: undefined,
        city: 'Ibagué',
        avatar_url: undefined,
        bio: undefined,
        interests: newUser.interests,
        date_of_birth: undefined,
        created_at: newUser.created_at,
      };
      
      // Crear sesión automáticamente (simular confirmación de email desactivada)
      const session = {
        access_token: `mock_token_${newUser.id}`,
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        expires_at: Date.now() + 86400000,
      };
      
      setUser(profile);
      setSession(session);
      
      // Guardar en storage
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.SESSION, JSON.stringify(session));
      
    } catch (err: any) {
      console.error('SignUp error:', err);
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      await simulateNetworkDelay();

      setUser(null);
      setSession(null);
      
      // Limpiar storage
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.SESSION);
      
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setLoading(true);
      setError(null);
      
      await simulateNetworkDelay();
      
      const updatedProfile = { ...user, ...updates };
      setUser(updatedProfile);
      
      // Actualizar en storage
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedProfile));
      
      // Actualizar en la lista de usuarios
      const users = await getStoredUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!session?.user) return;
    // En la versión local, no hay nada que refrescar desde el servidor
    console.log('Refresh user - Local mode');
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}