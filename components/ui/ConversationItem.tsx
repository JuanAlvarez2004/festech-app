import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Conversation } from '@/hooks/useConversations';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
  currentUserId: string;
}

export function ConversationItem({ conversation, onPress, currentUserId }: ConversationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Obtener información del otro participante (client o business)
  
  // Determinar nombre y avatar
  const getName = () => {
    if (conversation.client_id === currentUserId) {
      // El usuario actual es el cliente, mostrar el negocio
      return conversation.business?.name || 'Negocio';
    } else {
      // El usuario actual es el negocio, mostrar el cliente
      return conversation.client?.full_name || 'Cliente';
    }
  };

  const getAvatar = () => {
    if (conversation.client_id === currentUserId) {
      // El usuario actual es el cliente, mostrar avatar del negocio
      return conversation.business?.logo_url || 'https://via.placeholder.com/50x50';
    } else {
      // El usuario actual es el negocio, mostrar avatar del cliente
      return conversation.client?.avatar_url || 'https://via.placeholder.com/50x50';
    }
  };

  const getLastMessagePreview = () => {
    if (!conversation.last_message) {
      return 'No hay mensajes';
    }
    
    const { content, message_type, sender_id } = conversation.last_message;
    const isOwnMessage = sender_id === currentUserId;
    
    if (message_type === 'system') {
      return content;
    }
    
    const prefix = isOwnMessage ? 'Tú: ' : '';
    return `${prefix}${content}`;
  };

  const formatTime = () => {
    if (!conversation.last_message_at) return '';
    
    const messageDate = new Date(conversation.last_message_at);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) { // 24 horas
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return messageDate.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const isBusinessConversation = conversation.client_id !== currentUserId;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: getAvatar() }} 
          style={[
            styles.avatar,
            isBusinessConversation && styles.businessAvatar
          ]}
        />
        {isBusinessConversation && (
          <View style={[styles.businessBadge, { backgroundColor: colors.tint }]}>
            <Text style={styles.businessBadgeText}>🏪</Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text 
            style={[styles.name, { color: colors.text }]} 
            numberOfLines={1}
          >
            {getName()}
          </Text>
          <View style={styles.rightInfo}>
            <Text style={[styles.time, { color: colors.textSecondary }]}>
              {formatTime()}
            </Text>
            {(conversation.unread_count || 0) > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.unreadCount}>
                  {conversation.unread_count! > 99 ? '99+' : conversation.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.messageContainer}>
          <Text 
            style={[
              styles.lastMessage, 
              { 
                color: (conversation.unread_count || 0) > 0 
                  ? colors.text 
                  : colors.textSecondary,
                fontWeight: (conversation.unread_count || 0) > 0 ? '600' : 'normal'
              }
            ]} 
            numberOfLines={2}
          >
            {getLastMessagePreview()}
          </Text>
          <ChevronRight size={16} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  businessAvatar: {
    borderWidth: 2,
    borderColor: '#2A9D8F',
  },
  businessBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  businessBadgeText: {
    fontSize: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
});