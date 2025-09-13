import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Conversation } from '@/hooks/useConversations';
import { ArrowLeft, MoreVertical, Phone, VideoIcon } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: string;
  onBack: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMore?: () => void;
}

export function ChatHeader({ 
  conversation, 
  currentUserId, 
  onBack, 
  onCall, 
  onVideoCall, 
  onMore 
}: ChatHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Obtener información del otro participante basado en client_id y business_id
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
      return conversation.business?.logo_url || 'https://via.placeholder.com/40x40';
    } else {
      // El usuario actual es el negocio, mostrar avatar del cliente
      return conversation.client?.avatar_url || 'https://via.placeholder.com/40x40';
    }
  };

  const getSubtitle = () => {
    if (conversation.client_id === currentUserId) {
      return 'Negocio • En línea';
    }
    return 'Cliente • En línea';
  };

  const isBusinessConversation = conversation.client_id !== currentUserId;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
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
        
        <View style={styles.nameContainer}>
          <Text 
            style={[styles.name, { color: colors.text }]} 
            numberOfLines={1}
          >
            {getName()}
          </Text>
          <Text 
            style={[styles.subtitle, { color: colors.textSecondary }]} 
            numberOfLines={1}
          >
            {getSubtitle()}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        {onCall && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCall}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Phone size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {onVideoCall && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onVideoCall}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <VideoIcon size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        
        {onMore && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onMore}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    minHeight: 70,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  businessAvatar: {
    borderWidth: 2,
    borderColor: '#2A9D8F',
  },
  businessBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  businessBadgeText: {
    fontSize: 8,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});