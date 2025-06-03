// app/(tabs)/chat/[roomId].tsx
import { chatService } from '@/api/chatService';
import AppBar from '@/components/AppBar';
import ChatInput from '@/components/chat/ChatInput';
import ChatList from '@/components/chat/ChatList';
import { COLORS } from '@/constants/theme';
import { useChatInitializer } from '@/hooks/useChatInitializer';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/chat';
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

  console.log('3');

  const { roomId, isSimulation } = useLocalSearchParams<{
    roomId: string;
    isSimulation?: string;
  }>();
  
  const userId = "101";
  const senderName = '나';
  const sender = { id: userId, name: senderName };
  //const roomId = '68381b942a92be361d44eafb';
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);
  const noReplyTimerRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    socketList,
    socket
  } = useChatStore();

  console.log('🔥 UI에서 사용하는 메시지 리스트:', socketList);

  const { sendMessage } = useChatSocket(roomId, userId, senderName);

  if (roomId && userId && senderName) {
    useChatInitializer(roomId, userId, senderName);
  }

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      console.log('📤 방을 진짜로 나갑니다');
      // leave 이벤트 보냄
      socket.emit('leave', { roomId });
    });

    return unsubscribe;
  }, [navigation, roomId]);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  useEffect(() => {
    scrollToEnd();
  }, [socketList]);

    // ✅ isSimulation이 true일 경우 페르소나 불러오기
  useEffect(() => {
    if (isSimulation === 'true') {
      chatService.fetchSimulationPersona(roomId)
        .then((persona) => {
          console.log('🧠 시뮬레이션 페르소나:', persona);
          // TODO: 전역 저장 또는 UI 연동
        })
        .catch((err) => {
          console.error('❌ 페르소나 로딩 실패:', err);
        });
    }
  }, [roomId, isSimulation]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      roomId,
      sender,
      content,
      isRead: false,
      isMyMessage: true,
      isIceBreaker: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sendMessage(content);
    // ✅ 메시지는 socket에서 받도록 하며 직접 저장은 하지 않음

    if (noReplyTimerRef.current) clearTimeout(noReplyTimerRef.current);

    noReplyTimerRef.current = setTimeout(() => {
      handleNoReply(newMessage);
    }, 60000);
  };

  const handleNoReply = (lastMsg: Message) => {
    const isWaitingForMe = !lastMsg.isMyMessage;
    const waitingTarget = isWaitingForMe ? '나의' : '상대의';
    console.log(`🚨 1분 동안 ${waitingTarget} 응답 없음 → API 호출!`);
    // TODO: API 호출
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
          <ChatList ref={listRef} messages={socketList} />
          <ChatInput
            onSendMessage={handleSendMessage} // ✅ 여기서만 호출
            scrollToEnd={scrollToEnd}
            roomId={roomId}
            sender={sender}
            userId={userId}
            setMessages={setMessages}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
