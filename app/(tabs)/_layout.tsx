import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/theme';
import { ChatBubble } from '@/components/common/ChatBubble';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        sceneContainerStyle={{ backgroundColor: colors.background }}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ec4899',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: 'Jakarta-Bold',
            fontSize: 10,
            letterSpacing: 0.5,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? { backgroundColor: '#fce7f3', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4 } : undefined}>
                <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Lessons',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? { backgroundColor: '#fce7f3', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4 } : undefined}>
                <Ionicons name={focused ? 'book' : 'book-outline'} size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Practice',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? { backgroundColor: '#fce7f3', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4 } : undefined}>
                <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? { backgroundColor: '#fce7f3', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4 } : undefined}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
      <ChatBubble />
    </View>
  );
}
