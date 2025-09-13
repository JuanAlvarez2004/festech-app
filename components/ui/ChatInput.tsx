import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Paperclip, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function ChatInput({ 
  onSendMessage, 
  placeholder = "Escribe un mensaje...",
  disabled = false,
  maxLength = 1000
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending || disabled) return;

    setSending(true);
    try {
      const success = await onSendMessage(trimmedMessage);
      if (success) {
        setMessage('');
      } else {
        Alert.alert('Error', 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

  const handleAttachment = () => {
    // TODO: Implementar funcionalidad de archivos adjuntos
    Alert.alert(
      'Próximamente',
      'La funcionalidad de archivos adjuntos estará disponible pronto.'
    );
  };

  const canSend = message.trim().length > 0 && !sending && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.attachButton, { opacity: disabled ? 0.5 : 1 }]}
            onPress={handleAttachment}
            disabled={disabled}
          >
            <Paperclip size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={maxLength}
            editable={!disabled && !sending}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: canSend ? colors.tint : colors.border,
                opacity: disabled ? 0.5 : 1
              }
            ]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <Send 
              size={18} 
              color={canSend ? '#FFFFFF' : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {message.length > maxLength * 0.8 && (
          <View style={styles.characterCount}>
            <Text style={[
              styles.characterCountText,
              { 
                color: message.length >= maxLength 
                  ? '#DC3545' 
                  : colors.textSecondary 
              }
            ]}>
              {message.length}/{maxLength}
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  attachButton: {
    padding: 8,
    marginHorizontal: 4,
    alignSelf: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginBottom: 2,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    opacity: 0.7,
  },
});