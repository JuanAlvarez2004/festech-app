import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: -2,
        },
      }}>
      
      {/* Feed Principal - Estilo TikTok */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name={focused ? "house.fill" : "house"} 
              color={color} 
            />
          ),
        }}
      />

      {/* Explorar Negocios */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name={focused ? "magnifyingglass.circle.fill" : "magnifyingglass"} 
              color={color} 
            />
          ),
        }}
      />

      {/* Crear Contenido - Botón especial */}
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <IconSymbol 
              size={36} 
              name="plus.circle.fill" 
              color={focused ? Colors.accent : Colors.primary} 
            />
          ),
        }}
      />

      {/* Chat/Inbox */}
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name={focused ? "message.fill" : "message"} 
              color={color} 
            />
          ),
        }}
      />

      {/* Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name={focused ? "person.fill" : "person"} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
