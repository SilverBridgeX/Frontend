import { getSocket } from '@/lib/socketManager';
import { useChatStore } from '@/store/chatStore';

export const goToHomeAndConnectSocket = async () => {
  try {
    const socket = await getSocket(); // 소켓 연결
    useChatStore.getState().setSocket(socket); // 전역 store에 저장
  } catch (error) {
    console.error('❌ 소켓 연결 실패:', error);
  }
};
