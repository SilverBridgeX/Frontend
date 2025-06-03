// hooks/useChatSocket.ts
import { disconnectSocket, getSocket } from '@/lib/socketManager';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types/chat';
import { useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { useAIChatFlow } from './useAIChatFlow';

export const useChatSocket = (roomId: string, userId: string, senderName: string) => {

  const {
    setSocketList,
    setRecentTopicList,
    setAIList,
  } = useChatStore();

  const { handleAIFlow } = useAIChatFlow(roomId);

  const handleMessage = useCallback((message: Message) => {

    const messageWithId: Message = {
      ...message,
      id: uuid.v4() as string,
    };

    //UI용 리스트에 id와 메세지 추가
    setSocketList(messageWithId);

    //최근 토픽에 메세지 추가
    setRecentTopicList(message);

    //AI면 AI리스트에 메세지 추가 
    if (message.isIceBreaker) setAIList(message);

    handleAIFlow();

  }, [setSocketList, setRecentTopicList, setAIList, handleAIFlow, senderName]);


  useEffect(() => {

    if (!roomId || !userId) return;

    const socket = getSocket();

    socket.on('connect', () => {
      console.log('✅ 소켓 연결 성공');
      socket.emit('join', { roomId });
    });

    socket.off('message', handleMessage); // 중복 방지
    socket.on('message', handleMessage);

    socket.on('chat preview', (preview) => {
      console.log('📰 미리보기 알림:', preview);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ 소켓 연결 오류:', err.message);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ 소켓 연결 끊김');
    });

    return () => {
      socket.emit('leave', { roomId });
      socket.off('message', handleMessage);
      disconnectSocket();
    };
  }, [roomId, userId, handleMessage]);

  const sendMessage = (content: string) => {
    console.log('📤 메시지 전송 시도:', content);
    getSocket().emit('message', {
      roomId,
      senderName,
      message: content,
    });
  };

  return { sendMessage };

}; 