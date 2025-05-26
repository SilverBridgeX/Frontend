// types/message.ts
export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  name?: string;
  avatar?: any;
}
