import { sendToAI } from '@/api/aiService';
import { useChatStore } from '@/store/chatStore';
import { AIResponse, Message } from '@/types/chat';

export const useAIChatFlow = (roomId: string) => {
  const {
    socket,
    recentTopicList,
    iceBreakingAIList,
    stepNum,
    incrementStepNum,
    resetTopicLists
  } = useChatStore.getState();

  const handleAIFlow = async () => {

    try {
      const aiResponse: AIResponse = await sendToAI({
        room_id: roomId,
        step: stepNum, 
        message_list: recentTopicList.map(msg => msg.content),
        icebreaker_message_list: iceBreakingAIList.map(msg => msg.content),
    });

    const createAIMessage = (text: string): Message => ({
      roomId,
      content: text,
      sender: { name: '재롱이' },
      isIceBreaker: true,
      isMyMessage: false,
      isRead: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

      const newTopicMsg: Message = createAIMessage(aiResponse.text);

      if (aiResponse.state === 'switch') {
        incrementStepNum();
        resetTopicLists();     
        socket.emit('message', {
          roomId,
          senderName: '재롱이',
          message: aiResponse.text,
        });
      } else if (aiResponse.state === 'end') {
        resetTopicLists();
        socket.emit('message', {
          roomId,
          senderName: '재롱이',
          message: aiResponse.text,
        });

      } else if (!['switch', 'end', 'continue'].includes(aiResponse.state)) {
        console.warn('⚠️ 알 수 없는 AI 상태값:', aiResponse.state);
      }

      // 'continue'는 아무 작업 안 함
    } catch (err) {
      console.error('❌ AI 서버 호출 실패:', err);
    }
  };

  return { handleAIFlow };
};
