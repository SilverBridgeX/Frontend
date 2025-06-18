// hooks/useChatInitializer.ts

import { chatService } from '@/api/chatService';
import { useChatStore } from '@/store/chatStore';
import { useEffect } from 'react';
import uuid from 'react-native-uuid';

export const useChatInitializer = (roomId: string, userId: string, senderName: string) => {
  const {
    socket,
    iceBreakingAIList,
    setSocketList,
    setRecentTopicList,
    setAIList,
    resetTopicLists,
    resetSocketList,
  } = useChatStore();

  useEffect(() => {

    const init = async () => {

      socket.emit('join', { roomId });

      try {
        const messages = await chatService.fetchChatHistory(roomId, userId);

        console.log('📥 수신한 메시지:', messages);

        resetTopicLists();
        resetSocketList();

        // 전체 메시지 설정 (uuid 부여)
        messages.forEach((msg) => {
          const withId = {
             ...msg, 
             id: uuid.v4()
            };

          setSocketList(withId);
        });

        // 가장 최근의 isIceBreaker: true 메시지 이후부터 최근 주제 추출
        const lastAIIndex = [...messages].reverse().findIndex((msg) => msg.isIceBreaker);
        const startIndex = lastAIIndex >= 0 ? messages.length - lastAIIndex : 0;
        const recentSlice = messages.slice(startIndex);

        recentSlice.forEach((msg) => {
          setRecentTopicList(msg);
          if (msg.isIceBreaker) {
            setAIList(msg);
          }
        }); 

      } catch (err) {
        console.error('❌ 채팅 기록 초기화 실패:', err);
      }
    };

    init();
  }, [roomId, userId, senderName]);
};
