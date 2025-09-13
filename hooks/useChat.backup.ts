import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Message, MessageRead } from './useConversations';

export function useChat(conversationId: string, userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

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
  const sendMessage = useCallback(async (
    content: string, 
    messageType: 'text' | 'image' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    replyToMessageId?: string
  ) => {
    if (!userId || !conversationId || !content.trim()) return false;

    try {
      setSending(true);
      setError(null);

      const messageData = {
        conversation_id: conversationId,
        sender_id: userId,
        content: content.trim(),
        message_type: messageType,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        reply_to_message_id: replyToMessageId,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // El mensaje se agregará automáticamente via suscripción en tiempo real
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
      return false;
    } finally {
      setSending(false);
    }
  }, [userId, conversationId]);

  // Marcar mensaje como leído
  const markMessageAsRead = useCallback(async (messageId: string) => {
    if (!userId) return;

    try {
      // Verificar si ya está marcado como leído
      const { data: existingRead } = await supabase
        .from('message_reads')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .single();

      if (!existingRead) {
        await supabase
          .from('message_reads')
          .insert([{
            message_id: messageId,
            user_id: userId,
          }]);
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }, [userId]);

  // Marcar todos los mensajes como leídos
  const markAllAsRead = useCallback(async () => {
    if (!userId || !conversationId) return;

    try {
      // Obtener mensajes no leídos
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_deleted', false);

      if (unreadMessages && unreadMessages.length > 0) {
        // Marcar todos como leídos
        const readPromises = unreadMessages.map(msg => 
          supabase
            .from('message_reads')
            .upsert({
              message_id: msg.id,
              user_id: userId,
            }, {
              onConflict: 'message_id,user_id'
            })
        );

        await Promise.all(readPromises);

        // Actualizar timestamp de última lectura en participantes
        await supabase
          .from('conversation_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', userId);
      }
    } catch (err) {
      console.error('Error marking all messages as read:', err);
    }
  }, [userId, conversationId]);

  // Editar mensaje
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!userId || !newContent.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent.trim(),
          is_edited: true,
          edited_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error editing message:', err);
      setError(err instanceof Error ? err.message : 'Error al editar mensaje');
      return false;
    }
  }, [userId]);

  // Eliminar mensaje
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar mensaje');
      return false;
    }
  }, [userId]);

  // Cargar mensajes al montar el componente
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Marcar como leídos al entrar al chat
  useEffect(() => {
    if (conversationId && userId) {
      markAllAsRead();
    }
  }, [conversationId, userId, markAllAsRead]);

  // Suscripción en tiempo real para mensajes
  useEffect(() => {
    if (!conversationId) return;

    // Limpiar canal anterior si existe
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Obtener datos del sender
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender: Message = {
            ...newMessage,
            sender: senderData || undefined,
            reads: [],
          };

          setMessages(prev => [...prev, messageWithSender]);

          // Si no es nuestro mensaje, marcarlo como leído automáticamente
          if (newMessage.sender_id !== userId) {
            setTimeout(() => markMessageAsRead(newMessage.id), 1000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id 
                ? { ...msg, ...updatedMessage }
                : msg
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_reads',
        },
        (payload) => {
          const newRead = payload.new as MessageRead;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newRead.message_id
                ? { ...msg, reads: [...(msg.reads || []), newRead] }
                : msg
            )
          );
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, userId, markMessageAsRead]);

  // Obtener información del chat (participantes, etc.)
  const getChatInfo = useCallback(async () => {
    if (!conversationId) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            *,
            user:profiles(id, full_name, avatar_url),
            business:businesses(id, name, logo_url, owner_id)
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error getting chat info:', err);
      return null;
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    markMessageAsRead,
    markAllAsRead,
    editMessage,
    deleteMessage,
    refetch: fetchMessages,
    getChatInfo,
  };
}