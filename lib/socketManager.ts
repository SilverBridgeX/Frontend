// lib/socketManager.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://15.165.17.95');
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
