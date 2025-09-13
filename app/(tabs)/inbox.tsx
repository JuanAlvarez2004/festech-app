import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Loading } from '@/components/ui';
import { ChatBubble } from '@/components/ui/ChatBubbleSimple';
import { ChatHeader } from '@/components/ui/ChatHeader';
import { ChatInput } from '@/components/ui/ChatInput';
import { ConversationItem } from '@/components/ui/ConversationItem';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useConversations } from '@/hooks/useConversations';
import { useTabAuthGuard } from '@/hooks/useTabAuthGuard';
import { Message, useChat } from '../../hooks/useChat';

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { shouldShowContent } = useTabAuthGuard('inbox');
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversationId || null
  );
  const [showConversationsList, setShowConversationsList] = useState(!conversationId);
  
  const flatListRef = useRef<FlatList<Message>>(null);

  // Hooks para manejar conversaciones y chat
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    markConversationAsRead,
  } = useConversations(user?.id);

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
  } = useChat(activeConversationId);

  // Usar useMemo para calcular la conversación actual sin causar re-renders
  const currentConversation = useMemo(() => {
    if (!activeConversationId || conversations.length === 0) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [activeConversationId, conversations]);

  // Efecto simplificado solo para marcar como leída y controlar vista
  useEffect(() => {
    if (activeConversationId && currentConversation) {
      setShowConversationsList(false);
      markConversationAsRead(activeConversationId);
    }
  }, [activeConversationId]); // Solo depende del ID, no de la función

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Si no está autenticado, mostrar loading hasta que se resuelva
  if (!shouldShowContent) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Loading />
      </View>
    );
  }

  // Manejar selección de conversación
  const handleConversationSelect = (conversation: any) => {
    setActiveConversationId(conversation.id);
  };

  // Manejar envío de mensaje
  const handleSendMessage = async (messageText: string): Promise<boolean> => {
    if (!activeConversationId || !user?.id) return false;
    
    try {
      await sendMessage(messageText);
      // Marcar conversación como leída después de enviar
      markConversationAsRead(activeConversationId);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Manejar regreso a lista de conversaciones
  const handleBackToConversations = () => {
    setActiveConversationId(null);
    setShowConversationsList(true);
  };

  // Renderizar item de mensaje
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.sender_id === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isOwn && (!previousMessage || previousMessage.sender_id !== item.sender_id);
    const showTime = !previousMessage || 
      new Date(item.created_at).getTime() - new Date(previousMessage.created_at).getTime() > 300000; // 5 min

    return (
      <ChatBubble
        message={item}
        isOwn={isOwn}
        showAvatar={showAvatar}
        showTime={showTime}
        onLongPress={() => {
          // TODO: Implementar menú contextual para editar/eliminar mensajes
          if (isOwn) {
            Alert.alert(
              'Opciones del mensaje',
              '¿Qué deseas hacer con este mensaje?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Editar', onPress: () => console.log('Editar mensaje') },
                { text: 'Eliminar', style: 'destructive', onPress: () => console.log('Eliminar mensaje') },
              ]
            );
          }
        }}
      />
    );
  };

  // Renderizar item de conversación
  const renderConversation = ({ item }: { item: any }) => (
    <ConversationItem
      conversation={item}
      currentUserId={user?.id || ''}
      onPress={() => handleConversationSelect(item)}
    />
  );

  // Vista de chat activo
  if (!showConversationsList && activeConversationId && currentConversation) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ChatHeader
          conversation={currentConversation}
          currentUserId={user?.id || ''}
          onBack={handleBackToConversations}
          onCall={() => Alert.alert('Próximamente', 'Las llamadas estarán disponibles pronto')}
          onMore={() => Alert.alert('Próximamente', 'Más opciones estarán disponibles pronto')}
        />
        
        <View style={styles.chatContainer}>
          {messagesLoading ? (
            <View style={styles.loadingContainer}>
              <Loading text="Cargando mensajes..." />
            </View>
          ) : messagesError ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                Error al cargar los mensajes: {messagesError}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    👋 ¡Inicia la conversación!
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                    Envía un mensaje para comenzar a chatear
                  </Text>
                </View>
              }
            />
          )}
        </View>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          placeholder="Escribe tu mensaje..."
          disabled={messagesLoading || !!messagesError}
        />
      </View>
    );
  }

  // Vista de lista de conversaciones
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Mensajes
        </Text>
      </View>
      
      {conversationsLoading ? (
        <View style={styles.loadingContainer}>
          <Loading text="Cargando conversaciones..." />
        </View>
      ) : conversationsError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Error al cargar conversaciones: {conversationsError}
          </Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            💬 Sin conversaciones
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Aún no tienes mensajes. Visita un negocio y comienza a chatear.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  conversationsList: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    marginLeft: 78, // Offset para alinear con el texto después del avatar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});