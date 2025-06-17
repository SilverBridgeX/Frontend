import { getSocket } from '@/lib/socketManager';
import { useChatStore } from '@/store/chatStore';
import { Redirect } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

export default function Index() {
  const socketRef = useRef<Socket | null>(null); 
  const { setSocket, userId } = useChatStore();

  useEffect(() => {
    const connectSocket = async () => {
      if (!socketRef.current) {
        try {
          const socket = await getSocket(); // ✅ 비동기 대기
          socketRef.current = socket;
          setSocket(socket);
        } catch (error) {
          console.error('❌ 소켓 연결 실패:', error);
        }
      }
    };
    connectSocket();
  }, []);

  return <Redirect href="/login" />;
}

