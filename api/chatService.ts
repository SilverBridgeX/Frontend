import axiosChat from '@/lib/axiosChat';
import { Message } from '@/types/chat';

export const chatService = {
  // 1. STT 전송
  async sendAudioToSTT(audioUri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/mpeg',
      name: 'recording.mp3',
    } as any);

    try {
      const response = await axiosChat.post('/message/send-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ STT 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ STT 전송 실패:', error);
      throw error;
    }
  },

  // 2. 이전 채팅 내역 불러오기
  async fetchChatHistory(roomId: string): Promise<Message[]> {
    try {
      const response = await axiosChat.get('/message/list', {
        params: { roomId },
      });
      console.log(`✅ 채팅 히스토리 (${roomId}) 응답:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ 채팅 히스토리 (${roomId}) 로딩 실패:`, error);
      throw error;
    }
  },

  // 3. 채팅방 리스트 불러오기
  async fetchChatRoomList() {
    try {
      const response = await axiosChat.get('/room/list');
      console.log('✅ 채팅방 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 채팅방 목록 불러오기 실패:', error);
      throw error;
    }
  },

  // 4. 시뮬레이션 페르소나 불러오기
  async fetchSimulationPersona(roomId: string) {
    try {
      const response = await axiosChat.get('/simulation-persona', {
        params: { roomId },
      });
      console.log('✅ 시뮬레이션 페르소나 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 시뮬레이션 페르소나 로딩 실패:', error);
      throw error;
    }
  },
};
