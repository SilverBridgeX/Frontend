// lib/axiosChat.ts
import { getAccessToken } from '@/lib/tokenStorage';
import axios from 'axios';

const axiosChat = axios.create({
  baseURL: 'http://15.165.17.95/chat',
});

// ✅ accessToken 자동 추가 (비동기)
axiosChat.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosChat;
