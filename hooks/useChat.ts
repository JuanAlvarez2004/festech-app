import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Interfaces simples para el esquema existente
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type?: string;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface UseChatResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendingMessage: boolean;
  sendMessage: (content: string, type?: 'text' | 'image' | 'video') => Promise<void>;
  markAsRead: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useChat(conversationId: string | null): UseChatResult {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Cargar mensajes de la conversación
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setMessages(messagesData || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Enviar mensaje
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'video' = 'text') => {
    if (!conversationId || !content.trim()) return;

    try {
      setSendingMessage(true);
      setError(null);

      const messageData = {
        conversation_id: conversationId,
        sender_id: session?.user?.id,
        content: content.trim(),
        // Removemos 'type' ya que la columna no existe en tu esquema
      };

      console.log('Sending message:', messageData);

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      console.log('Message sent successfully:', data);

      // El mensaje se agregará automáticamente a través de la suscripción
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setSendingMessage(false);
    }
  }, [conversationId, session?.user?.id]);

  // Marcar conversación como leída
  const markAsRead = useCallback(async () => {
    if (!conversationId || !session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (error) throw error;
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [conversationId, session?.user?.id]);

  // Configurar suscripción en tiempo real para mensajes
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload.new);
          
          // Agregar el nuevo mensaje a la lista
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === payload.new.id);
            if (exists) return prev;
            
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Cargar mensajes cuando cambia la conversación
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendingMessage,
    sendMessage,
    markAsRead,
    refreshMessages: fetchMessages,
  };
}