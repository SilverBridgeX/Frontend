// app/(tabs)/chat/[roomId].tsx
import { getAssistantMessage } from '@/api/aiService'; // 맨 위 import에 추가
import { chatService } from '@/api/chatService';
import AppBar from '@/components/AppBar';
import ChatInput from '@/components/chat/ChatInput';
import ChatList from '@/components/chat/ChatList';
import { COLORS, SHADOWS } from '@/constants/theme';
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
  Text,
  Alert,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function ChatRoom() {

  console.log('3');

  const { roomId, isSimulation } = useLocalSearchParams<{
    roomId: string;
    isSimulation: string;
  }>();

  const {
    socketList,
    socket,
    userId,
    stepNum,
    setSimulationPersona,
    setStepNum,
  } = useChatStore();

  const senderName = '나';
  const sender = { id: userId, name: senderName };
  //const roomId = '68381b942a92be361d44eafb';
  const navigation = useNavigation();
  const listRef = useRef<FlatList>(null);
  const noReplyTimerRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // console.log('🔥 UI에서 사용하는 메시지 리스트:', socketList);

  const { sendMessage } = useChatSocket(roomId, userId, senderName, isSimulation);
  const [recommendedMessage, setRecommendedMessage] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<string | null>(null); 
  const { userRole } = useChatStore();
  const handlePrefillHandled = () => {
  setPrefill(null); // ✅ 입력창에 반영된 후 prefill 초기화
};

  const scrollToEnd = () => {
    if (socketList.length>0){
      listRef.current?.scrollToIndex({
        index: socketList.length-1,
        animated:true
      })
    }
    
  }

  if (roomId && userId && senderName) {
    useChatInitializer(roomId, userId, senderName);                                                                                                                                                      
  }

  useEffect(() => {
    chatService.getStepNum(roomId)
        .then((res) => {
          console.log('🧠 stepNum:', stepNum);
          setStepNum(res.stepNUm); // store에 저장
        })
        .catch((err) => {
          console.error('❌ stepNum 로딩 실패:', err);
        });
  }, []);

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
    console.log('isSimulation:', isSimulation);
    if (isSimulation === 'true') {
      chatService.fetchSimulationPersona(roomId)
        .then((persona) => {
          console.log('🧠 시뮬레이션 페르소나:', persona);
          setSimulationPersona(persona); // store에 저장
        })
        .catch((err) => {
          console.error('❌ 페르소나 로딩 실패:', err);
        });
    }
  }, [roomId, isSimulation, setSimulationPersona]);

  const handleFocus = () => {
    console.log("yeyeyeyeyeye")
    if (noReplyTimerRef.current) clearTimeout(noReplyTimerRef.current);

    noReplyTimerRef.current = setTimeout(() => {
      console.log("hdhasdhh")
      if (stepNum >= 10) handleNoReply();
    }, 10000); // 10초 후 응답 없으면 API 호출
  };

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
  };

  const handleNoReply = async() => {
    try {
      const { message } = await getAssistantMessage(Number(userId), roomId);
      if (message) {
        setRecommendedMessage(message); // 💡 추천 메시지로 저장
      }
    } catch (error) {
      console.error('❌ 어시스턴트 응답 실패:', error);
    }
  };

  
  const handleRecommendedClick = () => {
    if (recommendedMessage) {
      setPrefill(recommendedMessage);          // 👉 입력창에 값 설정
      setRecommendedMessage(null);            // 👉 추천 박스 제거
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 25}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          <AppBar title="채팅" />
          <ChatList ref={listRef} messages={socketList} />

          {recommendedMessage && (
            <TouchableWithoutFeedback onPress={handleRecommendedClick}>
              <View style={{
                marginHorizontal: 16,
                marginBottom: 8,
                backgroundColor: COLORS.lightLemon,
                padding: 12,
                borderRadius: 12, 
                ...SHADOWS.bubble,
              }}>
                <Text style={{ fontSize: 14, color: COLORS.black }}>
                  💡 {recommendedMessage}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}

          <ChatInput
            onFocus={handleFocus}
            onSendMessage={handleSendMessage} // ✅ 여기서만 호출
            scrollToEnd={scrollToEnd}
            roomId={roomId}
            sender={sender}
            userId={userId}
            setMessages={setMessages}
            prefillMessage={prefill}
            onPrefillHandled={handlePrefillHandled}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
