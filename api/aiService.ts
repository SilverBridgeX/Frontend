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

