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
  simulationPersona: any
): Promise<{ text: string }> => {
  try {
    const res = await axios.post(`${BASE_URL}/simulation/message`, {
      message_list: messageList,
      simulation_persona: simulationPersona,
    });
    return res.data;
  } catch (error) {
    console.error('❌ 시뮬레이션 메시지 요청 실패:', error);
    return { text: '' };
  }
};

