
import { ROLE } from '@/constants/user';
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

export const socialLogin = async ({
  role,
  email,
  nickname,
  streetAddress,
}: {
  role: typeof ROLE[keyof typeof ROLE];
  email: string;
  nickname: string;
  streetAddress: string;
}) => {
    console.log('📦 요청 body:', {
    role,
    email,
    nickname,
    streetAddress,
  });

  try {
    const response = await axios.post(`${BASE_URL}/token/generate/social`, {
      role,
      email,
      nickname,
      streetAddress,
    });

    return response.data;
  } catch (error) {
    console.error('소셜 로그인 실패:', error);
    throw error;
  }
};

// 로그인용 API 함수 추가
export const loginWithKey = async (key: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/token/generate/key`,
      null, // POST지만 바디는 없음
      {
        params: { key },
      }
    );
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

