// types/message.ts
export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  name?: string;
  avatar?: any;
  isAI?: boolean; // AI가 보낸 메시지 여부
}