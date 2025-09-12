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
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      
      // Si el perfil no existe, intentar crearlo (fallback)
      if (err.code === 'PGRST116') { // No rows returned
        try {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              full_name: authUser.user_metadata?.full_name || 'Usuario',
              user_type: authUser.user_metadata?.user_type || 'client',
              city: 'Ibagué',
            });
          
          if (!createError) {
            const profile = await getUserProfile(authUser.id);
            setUser(profile);
          } else {
            throw createError;
          }
        } catch (createErr) {
          console.error('Error creating fallback profile:', createErr);
          setError('Error al crear el perfil del usuario');
          setUser(null);
        }
      } else {
        setError('Error al cargar el perfil del usuario');
        setUser(null);
      }
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
            full_name: userData.fullName,
            user_type: userData.userType,
          },
        },
      });

      if (error) throw error;

      // Si el registro fue exitoso, crear el perfil
      // Nota: Según la documentación, los triggers automáticos crearán:
      // 1. El perfil en la tabla profiles
      // 2. La wallet con 50 coins de bienvenida
      // 3. La transacción de coins de registro
      if (data.user && !data.user.email_confirmed_at) {
        // Solo crear perfil manualmente si el email no está confirmado
        // (en caso de que los triggers no se ejecuten)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: userData.fullName,
            user_type: userData.userType,
            phone: userData.phone,
            city: 'Ibagué', // Ciudad por defecto según la documentación
            interests: userData.interests || [],
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // No lanzamos error aquí porque el usuario ya fue creado
        }
      }
    } catch (err: any) {
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