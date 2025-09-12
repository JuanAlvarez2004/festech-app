import { supabase } from './supabase';

// Configuración para login social (Google, Facebook)
// Nota: Requiere configuración adicional en Supabase Dashboard

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'festech://auth/callback',
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: 'festech://auth/callback',
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in with Facebook:', error);
    throw error;
  }
};

// Función para manejar el callback de OAuth
export const handleOAuthCallback = async (url: string) => {
  try {
    const { data, error } = await supabase.auth.getSessionFromUrl(url);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    throw error;
  }
};