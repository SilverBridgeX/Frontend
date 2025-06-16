// lib/axiosAI.ts
import { getAccessToken } from '@/lib/tokenStorage';
import axios from 'axios';

const axiosAI = axios.create({
  baseURL: 'http://15.165.17.95/ai',
});

// 필요한 경우 accessToken 추가하고 싶을 때:
axiosAI.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAI;
