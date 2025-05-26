// app/(tabs)/chat/[roomId].tsx
import AppBar from '@/components/AppBar';
import ChatInput from '@/components/chat/ChatInput';
import ChatList from '@/components/chat/ChatList';
import { COLORS } from '@/constants/theme';
import { Message } from '@/types/message';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function ChatRoom() {
  const navigation = useNavigation();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<FlatList>(null);

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 5 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <AppBar title="채팅" />
          <ChatList ref={listRef} messages={messages} />
          <ChatInput onSendMessage={setMessages} scrollToEnd={scrollToEnd} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
