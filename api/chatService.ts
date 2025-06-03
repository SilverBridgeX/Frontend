import { Message } from '@/types/chat';
import axios from 'axios';

const BASE_URL = 'http://15.165.17.95/chat';

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
      const response = await axios.post(`${BASE_URL}/message/send-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
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
  async fetchChatHistory(roomId: string, userId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${BASE_URL}/message/list`, {
        headers: {
          'x-user-id': userId,
          Accept: '*/*',
        },
        params: {
          roomId,
        },
      });
      console.log(`✅ 채팅 히스토리 (${roomId}) 응답:`, response.data);
      return response.data;
    } catch (error) { 
      console.error(`❌ 채팅 히스토리 (${roomId}) 로딩 실패:`, error);
      throw error;
    }
  },

  // 3. 채팅방 리스트 불러오기
  async fetchChatRoomList(userId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/room/list`, {
        headers: {
          'x-user-id': userId,
          Accept: '*/*',
        },
      });
      console.log('✅ 채팅방 목록 응답:', response.data);
      return response.data; // 배열 형태로 반환됨
    } catch (error) {
      console.error('❌ 채팅방 목록 불러오기 실패:', error);
      throw error;
    }
  },

    // 4. 시뮬레이션 페르소나 불러오기
  async fetchSimulationPersona(roomId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/simulation-persona`, {
        params: {
          roomId,
        },
        headers: {
          Accept: '*/*',
        },
      });
      console.log('✅ 시뮬레이션 페르소나 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ 시뮬레이션 페르소나 로딩 실패:', error);
      throw error;
    }
  }


};
