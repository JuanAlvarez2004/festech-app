import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  reply_to_message_id?: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  is_deleted: boolean;
  deleted_at?: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  reads?: MessageRead[];
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface Conversation {
  id: string;
  client_id: string;
  business_id: string;
  video_id?: string;
  coupon_context_id?: string;
  created_at: string;
  last_message_at: string;
  last_message?: Message;
  unread_count?: number;
  // Datos populados por joins
  business?: {
    id: string;
    name: string;
    logo_url?: string;
    owner_id: string;
  };
  client?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id?: string;
  business_id?: string;
  joined_at: string;
  last_read_at: string;
  is_active: boolean;
  role: 'admin' | 'member';
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  business?: {
    id: string;
    name: string;
    logo_url?: string;
    owner_id: string;
  };
}

export function useConversations(userId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener conversaciones del usuario con información del negocio y cliente
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select(`
          *,
          business:businesses(
            id,
            name,
            logo_url,
            owner_id
          ),
          client:profiles!conversations_client_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`client_id.eq.${userId},business_id.in.(${
          // Obtener IDs de negocios que pertenecen al usuario
          await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', userId)
            .then(({ data }) => {
              const businessIds = data?.map(b => b.id).join(',');
              return businessIds || '00000000-0000-0000-0000-000000000000'; // UUID inválido en lugar de 'null'
            })
        })`)
        .order('last_message_at', { ascending: false });

      if (conversationError) throw conversationError;

      // Para cada conversación, obtener el último mensaje y contar no leídos
      const conversationsWithDetails = await Promise.all(
        (conversationData || []).map(async (conv) => {
          // Obtener último mensaje
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles(id, full_name, avatar_url)
            `)
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Contar mensajes no leídos (simplificado para MVP)
          // En una implementación completa, tendrías una tabla de lecturas
          let unreadCount = 0;

          return {
            ...conv,
            last_message: lastMessage,
            unread_count: unreadCount,
          };
        })
      );

      setConversations(conversationsWithDetails);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Crear conversación con negocio
  const createBusinessConversation = useCallback(async (businessId: string) => {
    if (!userId) {
      console.log('❌ No hay userId para crear conversación');
      return null;
    }

    try {
      console.log('🚀 Intentando crear conversación:', { userId, businessId });
      
      // Primero verificar si ya existe una conversación
      const { data: existingConversation, error: checkError } = await supabase
        .rpc('get_existing_conversation', {
          p_user_id: userId,
          p_business_id: businessId,
        });

      if (checkError) {
        console.warn('⚠️ Error checking existing conversation:', checkError);
        // Continuar con el proceso de creación
      }

      if (existingConversation) {
        console.log('✅ Conversación existente encontrada:', existingConversation);
        await fetchConversations();
        return existingConversation;
      }

      // Crear nueva conversación
      const { data: newConversationId, error: createError } = await supabase
        .rpc('create_user_business_conversation', {
          p_user_id: userId,
          p_business_id: businessId,
        });

      if (createError) {
        console.error('❌ Error creating conversation:', createError);
        throw createError;
      }

      if (!newConversationId) {
        throw new Error('No se retornó ID de conversación');
      }

      console.log('✅ Nueva conversación creada:', newConversationId);

      // Refrescar la lista de conversaciones
      await fetchConversations();
      
      return newConversationId;
    } catch (err) {
      console.error('❌ Error in createBusinessConversation:', err);
      setError(err instanceof Error ? err.message : 'Error al crear conversación');
      return null;
    }
  }, [userId, fetchConversations]);

  // Marcar conversación como leída (simplificado para MVP)
  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (!userId) return;

    try {
      // Para MVP, simplemente actualizamos el timestamp local
      // En una implementación completa, tendrías una tabla de lecturas
      setConversations(prev => {
        const updated = prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        );
        // Solo actualizar si realmente cambió algo
        return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
      });
    } catch (err) {
      console.error('Error marking conversation as read:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Suscripción en tiempo real para conversaciones
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    createBusinessConversation,
    markConversationAsRead,
  };
}