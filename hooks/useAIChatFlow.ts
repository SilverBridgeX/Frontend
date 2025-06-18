import { getSimulationMessage, sendToAI } from '@/api/aiService';
import { useChatStore } from '@/store/chatStore';
import { AIResponse } from '@/types/chat';
import uuid from 'react-native-uuid';

export const useAIChatFlow = (roomId: string, isSimulation: string) => {
  const {
    socket,
    recentTopicList,
    iceBreakingAIList,
    setSocketList,
    socketList,
    stepNum,
    resetTopicLists,
    simulationPersona, // store에서 가져옴
  } = useChatStore.getState();

  const handleAIFlow = async () => {
    try {

      if (isSimulation === 'true' && simulationPersona) {
        const recentContents = socketList
          .map(msg => msg.content)
          .slice(-10);

        const simulationMessages = await getSimulationMessage(
          recentContents,
          simulationPersona,
          roomId
        );

        // simulationMessages.text를 "재롱이" 메시지로 socketList에 저장
        const simulationMsg = {
          id: uuid.v4() as string,
          roomId,
          sender: { name: '재롱이' },
          content: simulationMessages.text,
          isRead: false,
          isMyMessage: false,
          isIceBreaker: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // socketList에 추가
        setSocketList(simulationMsg);

      }
      else {
        const aiResponse: AIResponse = await sendToAI({
          room_id: roomId,
          step: stepNum, 
          message_list: recentTopicList.map(msg => msg.content),
          icebreaker_message_list: iceBreakingAIList.map(msg => msg.content),
        });

        if (aiResponse.state === 'switch') {
          resetTopicLists();
          socket.emit('messageIB', {
            roomId,
            senderName: '재롱이',
            message: aiResponse.text,
          });
        } else if (aiResponse.state === 'end') {
          resetTopicLists(); 
          socket.emit('messageIB', {
            roomId,
            senderName: '재롱이',
            message: aiResponse.text,
          });
        } else if (!['switch', 'end', 'continue'].includes(aiResponse.state)) {
          console.warn('⚠️ 알 수 없는 AI 상태값:', aiResponse.state);
        }

      }


      // 'continue'는 아무 작업 안 함
    } catch (err) {
      console.error('❌ AI 서버 호출 실패:', err);
    }
  };

  return { handleAIFlow };
};
