import { ROLE } from '@/constants/user';
import axiosUser from '@/lib/axiosUser';
import { getAccessToken, getRefreshToken, setTokens } from '@/lib/tokenStorage';
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

// ✅ 로그인 API
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
  console.log(role);
  console.log(email);
  console.log(nickname);
  console.log(streetAddress);
  try {
    
    const response = await axiosUser.post(`${BASE_URL}/members/social/sign-in`, {
      role,
      email,
      nickname,
      streetAddress,
    });

    const { accessToken, refreshToken } = response.data.result;

    // ✅ AsyncStorage에 토큰 저장
    await setTokens(accessToken, refreshToken);
    
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

// ✅ 소셜 로그인 API
export const socialShortLogin = async ({
  role,
  email,
}: {
  role: typeof ROLE[keyof typeof ROLE];
  email: string;
}) => {
  try {
    const response = await axiosUser.post(`${BASE_URL}/members/social/login`, {
      role,
      email,
    });

    const { accessToken, refreshToken } = response.data.result;

    // ✅ 토큰 저장
    await setTokens(accessToken, refreshToken);

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
    const before_refreshToken = await getRefreshToken();
    //console.log('리프레시 토큰큰', error);

    const response = await axios.post(`${BASE_URL}/members/reissue`, null, {
      headers: {
        Authorization: `Bearer ${before_refreshToken}`,
      },
    });

    const { accessToken, refreshToken } = response.data.result;

    // ✅ AsyncStorage에 토큰 저장
    await setTokens(accessToken, refreshToken);

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



/** ✅ 결제 상태 확인 */
export const getPaymentStatus = async () => {
  try {
    const res = await axiosUser.get('/payment/subscribe/status');
    return res.data;
  } catch (error) {
    console.error('결제 상태 확인 실패:', error);
    throw error;
  }
};

export const getPaymentStatusWithKey = async ({ id }: { id: string }) => {
  try {
    const res = await axiosUser.get('/payment/subscribe/status/key', {
      params: { id },
    });
    return res.data;
  } catch (error) {
    console.error('결제 상태 확인 실패:', error);
    throw error;
  }
};

/** ✅ 결제 URL 요청 */
export const requestPaymentReady = async () => {
  try {
    const res = await axiosUser.post('/payment/ready');
    return res.data;
  } catch (error) {
    console.error('결제 준비 요청 실패:', error);
    throw error;
  }
};

export const requestPaymentReadyWithKey = async ({ id }: { id: string }) => {
  console.log(id);
  try {
    
    const res = await axiosUser.post('/payment/ready/key', 
      {}, // POST body (비워둠)
      {
        params: { id }, // 쿼리 스트링
      }
    );
    return res.data;
  } catch (error) {
    console.error('보호자 결제 준비 요청 실패:', error);
    throw error;
  }
};

/** ✅ 결제 해지 */
export const cancelSubscription = async () => {
  try {
    const res = await axiosUser.post('/payment/subscribe/cancel');
    return res.data;
  } catch (error) {
    console.error('결제 해지 실패:', error);
    throw error;
  }
};

export const cancelSubscriptionWithKey = async ({ id }: { id: string }) => {
  try {
    const res = await axiosUser.post('/payment/subscribe/cancel/key', 
      {}, // POST body (비워둠)
      {
        params: { id }, // 쿼리 스트링
      }
    );
    return res.data;
  } catch (error) {
    console.error('결제 해지 실패:', error);
    throw error;
  }
};


export const kakaoLoginWithCode = async (code: string) => {
  try {
    console.log('카카오 로그인', code);
    const res = await axiosUser.get('/members/code/kakao', {
      params: { code },
    });
    return res.data;
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    throw error;
  }
};

//보호자 api
export const registerOlderByGuardian = async ({
  role,
  email,
  nickname,
  streetAddress,
}: {
  role: string
  email: string;
  nickname: string;
  streetAddress: string;
}) => {
  try {
    const token = await getAccessToken();
    console.log('🔐 [registerOlderByGuardian] accessToken:', token);

    const res = await axiosUser.post('/members/guardians/olders', {
      role: 'OLDER',
      email,
      nickname,
      streetAddress,
    });
    return res.data;
  } catch (error) {
    console.error('노인 등록 실패:', error);
    throw error;
  }
};

export const linkOlderToGuardian = async (olderKey: string) => {
  try {
    const res = await axiosUser.post('/members/guardians/older-links', null, {
      params: { olderKey },
    });
    return res.data;
  } catch (error) {
    console.error('노인 연결 실패:', error);
    throw error;
  }
};

/** ✅ 보호자 연결 노인 조회 */
export const getGuardianMyPage = async () => {
  try {
    const res = await axiosUser.get('/members/mypage/guardian');
    return res.data;
  } catch (error) {
    console.error('보호자 연결 노인 조회 실패:', error);
    throw error;
  }
};

/** ✅ 추천 활동 리스트 조회 API */
export const getRecommendedActivities = async () => {
  try {
    const res = await axiosUser.get('/activities/recommend-activity');
    return res.data.result.recommendActivityResDtos;
  } catch (error) {
    console.error('추천 활동 리스트 조회 실패:', error);
    throw error;
  }
};

