import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Message } from '../../hooks/useChat';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
  onLongPress?: () => void;
}

export function ChatBubble({ 
  message, 
  isOwn, 
  showAvatar = true, 
  showTime = true,
  onLongPress 
}: ChatBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Mensaje del sistema
  if (message.type === 'system') {
    return (
      <View style={[styles.systemContainer, { backgroundColor: colors.border }]}>
        <Text style={[styles.systemText, { color: colors.textSecondary }]}>
          {message.content}
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {!isOwn && showAvatar && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: message.sender?.avatar_url || 'https://via.placeholder.com/32x32'
            }}
            style={styles.avatar}
          />
        </View>
      )}
      
      <TouchableOpacity
        style={[
          styles.bubble,
          {
            backgroundColor: isOwn ? '#007AFF' : colors.card,
            borderColor: colors.border,
          },
          isOwn && styles.ownBubble,
        ]}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.messageText, { color: isOwn ? '#FFFFFF' : colors.text }]}>
          {message.content}
        </Text>
        
        {showTime && (
          <View style={[
            styles.timeContainer,
            isOwn ? styles.ownTimeContainer : styles.otherTimeContainer
          ]}>
            <Text style={[
              styles.timeText, 
              { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
            ]}>
              {formatTime(message.created_at)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    marginHorizontal: 16,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    marginLeft: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E7',
  },
  bubble: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timeContainer: {
    marginTop: 4,
  },
  ownTimeContainer: {
    alignItems: 'flex-end',
  },
  otherTimeContainer: {
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 12,
    opacity: 0.7,
  },
  systemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  systemText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});