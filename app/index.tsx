import { getSocket } from '@/lib/socketManager';
import { useChatStore } from '@/store/chatStore';
import { Redirect } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

export default function Index() {
  const socketRef = useRef<Socket | null>(null); 
  const { setSocket, userId } = useChatStore();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = getSocket(userId); // ✅ getSocket() 딱 한 번만 실행됨
      setSocket(socketRef.current);
    }
  }, []);

  return <Redirect href="/login" />;
}