import { ROLE } from '@/constants/user';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { Message } from '../types/chat';

interface ChatState {
  socketList: Message[];
  recentTopicList: Message[];
  iceBreakingAIList: Message[];
  stepNum: number;
  socket: Socket;
  userId: string; 
  simulationPersona: any;
  userName:string;
  userGender:string;
  userRole: typeof ROLE[keyof typeof ROLE];
  isRegisteringByGuardian: boolean;
  key:string;

  setSocketList: (msg: Message) => void;
  setRecentTopicList: (msg: Message) => void;
  setAIList: (msg: Message) => void;
  setStepNum: (num: number) => void;
  resetTopicLists: () => void;
  resetSocketList: () => void; 
  setInitialStepNum: (step: number) => void;
  setSocket: (socket: Socket) => void;
  setSimulationPersona: (persona: any) => void;
  setUserRole: (role: typeof ROLE[keyof typeof ROLE]) => void;
  setIsRegisteringByGuardian: (val: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  userId: '2525', // 예시로 고정된 userId, 실제로는 로그인 정보 등에서 가져와야 함
  userName:'상신',
  userGender:'여성',
  socketList: [],
  recentTopicList: [],
  iceBreakingAIList: [],
  stepNum: 0,
  socket: null as unknown as Socket,
  simulationPersona: null,
  userRole: '',
  isRegisteringByGuardian: false,
  key: '',


  setSocketList: (msg) =>
    set((state) => ({
      socketList: [...state.socketList, msg],
    })),

  setRecentTopicList: (msg) =>
    set((state) => ({
      recentTopicList: [...state.recentTopicList, msg],
    })),

  setAIList: (msg) =>
    set((state) => ({
      iceBreakingAIList: [...state.iceBreakingAIList, msg],
    })),

  setStepNum: (num) =>
    set(() => ({
      stepNum: num,
    })),

  resetTopicLists: () =>
    set(() => ({
      recentTopicList: [],
      iceBreakingAIList: [],
    })),

  resetSocketList: () => set({ socketList: [] }),

  setInitialStepNum: (step) =>
    set(() => ({
      stepNum: step,
    })),
  
  setSocket: (socket) =>
    set(() => ({
      socket: socket,
    })),

  setSimulationPersona: (persona) => set({ simulationPersona: persona }),

  setUserRole: (role: typeof ROLE[keyof typeof ROLE]) => set({ userRole: role }),

  setIsRegisteringByGuardian: (val: boolean) => set({ isRegisteringByGuardian: val }),

}));