// lib/axiosUser.ts
import { reissueToken } from '@/api/userService';
import { getAccessToken, setTokens } from '@/lib/tokenStorage';
import axios from 'axios';

const axiosUser = axios.create({
  baseURL: 'http://15.165.17.95/user',
});

// ✅ 요청 인터셉터: accessToken 자동 삽입
axiosUser.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    console.log(accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401이면 토큰 재발급 시도
axiosUser.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const reissueResponse = await reissueToken();
        const { accessToken, refreshToken } = reissueResponse.result;

        // ✅ AsyncStorage에 토큰 갱신
        await setTokens(accessToken, refreshToken);

        // ✅ 새 accessToken으로 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosUser(originalRequest);
      } catch (e) {
        console.error('토큰 재발급 실패 후 재요청 불가:', e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosUser;
