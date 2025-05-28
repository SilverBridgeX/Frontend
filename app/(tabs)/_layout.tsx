import { HapticTab } from '@/components/HapticTab';
import { COLORS } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform } from 'react-native';

const HomeIcon = require('@/assets/images/tab_home.png');
const ChatIcon = require('@/assets/images/tab_chat.png');
const MyIcon = require('@/assets/images/tab_my.png');

export default function TabLayout() {

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: COLORS.black,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarStyle: Platform.select({
        ios: {
          backgroundColor: COLORS.white,
        }, 
        default: {
          backgroundColor: COLORS.white,
        },
        
      }),
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        }

  }}
> 
  <Tabs.Screen
    name="home"
    options={{
      title: '홈',
      tabBarIcon: ({ focused }) =>  (
        <Image
              source={HomeIcon}
              resizeMode="contain"
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.6,
              }} 
          />
        ),
    }}
  /> 
  <Tabs.Screen
    name="chat"
    options={{
      title: '채팅',
      tabBarIcon: ({ focused }) =>  (
        <Image
              source={ChatIcon}
              resizeMode="contain"
              style={{
                width: 34,
                height: 34,
                opacity: focused ? 1 : 0.6,
              }} 
          />
        ),
    }}
  />
  <Tabs.Screen
    name="mypage"
    options={{
      title: '마이',
      tabBarIcon: ({ focused }) =>  (
        <Image
              source={MyIcon}
              resizeMode="contain"
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.6,
              }} 
          />
      ),
    }}
  />
</Tabs>

  );
}
