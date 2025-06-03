
import axios from 'axios';

const BASE_URL = 'http://15.165.17.95/user'; // 실제 API 서버 주소로 교체

export const requestMatching = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/match/requests`);
    return response.data;
  } catch (error) {
    console.error('매칭 요청 실패:', error);
    throw error;
  }
};
