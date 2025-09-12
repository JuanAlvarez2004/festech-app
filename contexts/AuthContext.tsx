import { supabase } from '@/lib/supabase';
import type { AuthState, Profile } from '@/types';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Helper para obtener el perfil completo del usuario con manejo robusto
export const getUserProfileRobust = async (userId: string) => {
  try {
    console.log('Buscando perfil para usuario:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    console.log('Resultado consulta perfil:', { data, error });
    
    if (error) {
      console.error('Error consultando perfil:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('❌ No se encontró perfil para usuario:', userId);
      return null;
    }
    
    console.log('✅ Perfil encontrado:', data[0]);
    return data[0];
  } catch (err) {
    console.error('Error en getUserProfileRobust:', err);
    throw err;
  }
};

// Helper para crear perfil manualmente si los triggers fallan
export const createUserProfileManual = async (authUser: User) => {
  try {
    console.log('🛠️ Creando perfil manual para:', authUser.id);
    
    const metadata = authUser.user_metadata || {};
    const interests = metadata.interests ? metadata.interests.split(',') : [];
    
    // Crear perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.id,
        email: authUser.email || '',
        full_name: metadata.full_name || 'Usuario',
        user_type: metadata.user_type || 'client',
        interests: interests,
        city: 'Ibagué'
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error creando perfil manual:', profileError);
      throw profileError;
    }
    
    console.log('✅ Perfil creado manualmente:', profile);
    
    // Crear wallet si es cliente
    if (metadata.user_type === 'client' || !metadata.user_type) {
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: authUser.id,
          balance: 50
        });
      
      if (walletError) {
        console.error('Error creando wallet:', walletError);
      } else {
        console.log('✅ Wallet creado manualmente');
        
        // Crear transacción de bienvenida
        await supabase
          .from('coin_transactions')
          .insert({
            user_id: authUser.id,
            amount: 50,
            type: 'earn',
            description: 'Bonus de bienvenida por registrarte'
          });
        
        console.log('✅ Transacción de bienvenida creada');
      }
    }
    
    return profile;
  } catch (err) {
    console.error('Error en createUserProfileManual:', err);
    throw err;
  }
};

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
      
      console.log('🔍 Cargando perfil para usuario:', authUser.id);
      
      const profile = await getUserProfileRobust(authUser.id);
      
      if (!profile) {
        console.log('⚠️ Perfil no encontrado, intentando crear...');
        // Intentar crear perfil manualmente
        await createUserProfileManual(authUser);
        
        // Reintentar obtener perfil
        const newProfile = await getUserProfileRobust(authUser.id);
        setUser(newProfile);
      } else {
        setUser(profile);
      }
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

      console.log('Intentando registrar usuario:', { email, userData });

      // Convertir interests array a string para metadata
      const interestsString = Array.isArray(userData.interests) 
        ? userData.interests.join(',') 
        : '';

      // Registrar usuario en Supabase Auth con options específicas
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type,
            interests: interestsString,
          },
          emailRedirectTo: undefined, // Evitar redirects
        },
      });

      console.log('Respuesta de signUp:', { data, error });

      if (error) {
        console.error('Error en signUp:', error);
        throw error;
      }

      // Verificar si el usuario fue creado correctamente
      if (!data.user) {
        throw new Error('No se pudo crear el usuario');
      }

      console.log('Usuario creado:', data.user.id);

      // Esperar un momento para que los triggers se ejecuten
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que el perfil se creó correctamente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('Perfil encontrado:', { profile, profileError });

      // Si hay sesión, cargar el perfil
      if (data.session) {
        console.log('Sesión creada, cargando perfil...');
        await loadUserProfile(data.user);
      } else {
        console.log('No hay sesión inmediata, usuario necesita confirmación');
        // No fallar, simplemente informar que se creó el usuario
        setUser(null);
      }

    } catch (err: any) {
      console.error('SignUp error completo:', err);
      
      // Manejo específico de errores de Supabase
      let errorMessage = 'Error al crear la cuenta';
      
      if (err.message?.includes('Database error')) {
        errorMessage = 'Error en la base de datos. Verifica la configuración de Supabase.';
      } else if (err.message?.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (err.message?.includes('Password')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.message?.includes('email')) {
        errorMessage = 'Por favor ingresa un email válido.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
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