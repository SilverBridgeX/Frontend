// app/index.tsx
import { getSocket } from '@/lib/socketManager';
import { useChatStore } from '@/store/chatStore';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';


export default function Index() {

const {
    setSocket
  } = useChatStore();

  useEffect(() => {
    setSocket(getSocket()); // ✅ 앱 시작 시 1회 연결
  }, []);
  
 return <Redirect href="/home" />;
  // 슬래시(/) 없이 상대 경로 권장
}
