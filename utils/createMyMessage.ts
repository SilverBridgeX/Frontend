// utils/createMyMessage.ts
import { Message } from '@/types/chat';

export function createMyMessage(content: string, roomId: string, senderName: string): Message {
  const now = new Date().toISOString();

  return {
    roomId,
    sender: { name: senderName },
    content,
    isRead: false,
    isMyMessage: true,
    isIceBreaker: false,
    createdAt: now,
    updatedAt: now,
  };
}
