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
  const noReplyTimerRef = useRef<number | null>(null);

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: undefined });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const handleNewMessages = (newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);

    const lastMsg = newMessages[newMessages.length - 1];
    const amISender = lastMsg.fromMe;

    if (noReplyTimerRef.current) clearTimeout(noReplyTimerRef.current);

    noReplyTimerRef.current = setTimeout(() => {
      handleNoReply(lastMsg);
    }, 60000); // 1분 후 실행
  };

  const handleNoReply = (lastMsg: Message) => {
    const isWaitingForMe = !lastMsg.fromMe;
    const waitingTarget = isWaitingForMe ? '나의' : '상대의';

    console.log(`🚨 1분 동안 ${waitingTarget} 응답 없음 → API 호출!`);

    // TODO: 여기에 API 호출 작성
    // await api.notifyNoReply(roomId, waitingTarget);
  };

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
          <ChatInput
            onSendMessage={(msg: Message) => handleNewMessages([msg])}
            scrollToEnd={scrollToEnd}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
