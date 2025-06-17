// lib/socketManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;


export const getSocket = async (): Promise<Socket> => {

  if (!socket) {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('❌ accessToken이 없습니다. 소켓 연결을 시도할 수 없습니다.');
    }
    socket = io('http://15.165.17.95', {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('🌐 socket 생성 및 연결');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🧹 socket 연결 해제');
  }
};

export const isSocketConnected = (): boolean => {
  return !!socket && socket.connected;
};
