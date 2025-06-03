// api/aiService.ts
import { AIRequestPayload, AIResponse } from '@/types/chat';
import axios from 'axios';

const BASE_URL = 'http://15.165.17.95/ai'; 

export const sendToAI = async (payload: AIRequestPayload): Promise<AIResponse> => {
  try {
    const res = await axios.post<AIResponse>(`${BASE_URL}/icebreaking/`, payload);
    return res.data;
  } catch (error) {
    console.error('AI 서버 전송 실패:', error);
    return { state: 'continue', text: '' };
  }
};

export const getSimulationMessage = async (
  messageList: string[],
  simulationPersona: any,
  roomId: string
): Promise<{ text: string }> => {
  try {
    const res = await axios.post(`${BASE_URL}/simulation/message`, {
      message_list: messageList,
      simulation_persona: simulationPersona,
      room_id: roomId
    });
    return res.data;
  } catch (error) {
    console.error('❌ 시뮬레이션 메시지 요청 실패:', error);
    return { text: '' };
  }
};

export const createSimulationRoom = async (
  userId: number,
  userName: string,
  userGender: string
): Promise<{ room_id: string }> => {
  try {
    const res = await axios.post(`${BASE_URL}/simulation/room`, {
      user_id: userId,
      user_name: userName,
      user_gender: userGender,
    });
    return res.data;
  } catch (error) {
    console.error('❌ 시뮬레이션 방 생성 실패:', error);
    return { room_id: '' };
  }
};

export const getAssistantMessage = async (
  userId: number,
  roomId: string
): Promise<{ message: string }> => {
  try {
    const res = await axios.get(`${BASE_URL}/assistant`, {
      params: {
        userId,
        roomId
      }
    });
    return res.data;
  } catch (error) {
    console.error('❌ 어시스턴트 호출 실패:', error);
    return { message: '' };
  }
};



