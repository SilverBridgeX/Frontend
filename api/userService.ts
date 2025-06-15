import { ROLE } from '@/constants/user';
import axiosUser from '@/lib/axiosUser';
import { getRefreshToken, setTokens } from '@/lib/tokenStorage';
import axios from 'axios';

const BASE_URL = 'http://15.165.17.95/user';

// ✅ 매칭 요청 API (axiosUser 사용)
export const requestMatching = async () => {
  try {
    const response = await axiosUser.post('/match/requests');
    return response.data;
  } catch (error) {
    console.error('매칭 요청 실패:', error);
    throw error;
  }
};

// ✅ 소셜 로그인 API
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
  try {
    const response = await axios.post(`${BASE_URL}/members/social/login`, {
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

// ✅ 키 기반 로그인 API
export const loginWithKey = async (key: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/members/key/login`, null, {
      params: { key },
    });

    const { accessToken, refreshToken } = response.data.result;

    // ✅ AsyncStorage에 토큰 저장
    await setTokens(accessToken, refreshToken);

    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// ✅ 토큰 재발급 API
export const reissueToken = async () => {
  try {
    const refreshToken = await getRefreshToken();

    const response = await axios.post(`${BASE_URL}/members/reissue`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    throw error;
  }
};

// ✅ 매칭 상태 확인 API
export const checkMatchingStatus = async (): Promise<boolean> => {
  try {
    const response = await axiosUser.post('/match/requests/results');
    const data = response.data;

    if (data.isSuccess && typeof data.result === 'boolean') {
      return data.result;
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('매칭 상태 확인 실패:', error);
    throw error;
  }
};


