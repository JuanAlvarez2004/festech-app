import { getUserProfile, supabase } from '@/lib/supabase';
import type { AuthState, Profile } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await getUserProfile(authUser.id);
      setUser(profile);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Error al cargar el perfil del usuario');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // El perfil se cargará automáticamente por el listener onAuthStateChange
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

      // Registrar usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type,
            interests: userData.interests,
          },
        },
      });

      if (error) throw error;

      // Verificar si el usuario fue creado correctamente
      if (!data.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // Verificar si hay sesión inmediata (email confirmation disabled)
      if (data.session) {
        // Email confirmation está desactivada - proceso normal
        // Esperar un poco para que el trigger se ejecute
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar el perfil con los intereses si fueron proporcionados
        if (userData.interests && userData.interests.length > 0) {
          await supabase
            .from('profiles')
            .update({ interests: userData.interests })
            .eq('id', data.user.id);
        }
        
        await loadUserProfile(data.user);
      } else {
        // Email confirmation está activada - simular éxito para desarrollo
        console.log('Usuario creado, esperando confirmación de email:', data.user.email);
        
        // Para desarrollo, podemos mostrar un mensaje diferente o intentar login automático
        // En lugar de fallar, vamos a permitir que continúe
        setUser(null); // No hay sesión hasta confirmar email
        setLoading(false);
        
        // Retornar sin error para no bloquear el flujo
        return;
      }

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

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
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

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser({ ...user, ...data });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!session?.user) return;
    await loadUserProfile(session.user);
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