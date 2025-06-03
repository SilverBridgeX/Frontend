import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { Message } from '../types/chat';

interface ChatState {
  socketList: Message[];
  recentTopicList: Message[];
  iceBreakingAIList: Message[];
  stepNum: number;
  socket: Socket

  setSocketList: (msg: Message) => void;
  setRecentTopicList: (msg: Message) => void;
  setAIList: (msg: Message) => void;
  incrementStepNum: () => void;
  resetTopicLists: () => void;
  resetSocketList: () => void; 
  setInitialStepNum: (step: number) => void;
  setSocket: (socket: Socket) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  socketList: [],
  recentTopicList: [],
  iceBreakingAIList: [],
  stepNum: 0,
  socket: null as unknown as Socket,

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

  incrementStepNum: () =>
    set((state) => ({
      stepNum: state.stepNum + 1,
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
}));