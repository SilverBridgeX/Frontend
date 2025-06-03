
export interface Sender {
  name: string;
}

export interface Message {
  id?: string;
  roomId: string;
  sender: Sender;
  content: string;
  isRead: boolean;
  isMyMessage: boolean;
  isIceBreaker: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIRequestPayload {
  room_id: string;
  step: number;
  message_list: string[];
  icebreaker_message_list: string[];
}

export interface AIResponse {
  state: 'switch' | 'continue' | 'end';
  text: string;
}

