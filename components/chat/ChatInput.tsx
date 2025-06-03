import { COLORS, FONT_SIZES, INPUT_HEIGHT, SHADOWS, SPACING } from '@/constants/theme';
import { Message, Sender } from '@/types/chat';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
//import useVoiceInput from '../../hooks/useVoiceInput';

const Send = require('../../assets/images/btn_send.png');
//const MicIcon = require('../../assets/images/img_mike.png');
//const PlayIcon = require('../../assets/images/icon_play.png');
//const ActivityIcon = require('../../assets/images/icon_activity.png');

const SENSITIVE_PATTERNS = [
  { type: '휴대폰 번호', regex: /01[016789]-?\d{3,4}-?\d{4}/ },
  { type: '주민등록번호', regex: /\d{6}-?[1-4]\d{6}/ },
  { type: '이메일 주소', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { type: '신용카드 번호', regex: /\b(?:\d[ -]*?){13,16}\b/ },
  { type: '계좌번호', regex: /\d{2,3}-\d{2,6}-\d{6,8}/ },
];

const categoryToImage: Record<string, any> = {
  산책: require('../../assets/images/activity_walk.png'),
  축제: require('../../assets/images/activity_festival.png'),
};

interface Props {
  onSendMessage: (content: string) => void;
  scrollToEnd: () => void;
  roomId: string;
  sender: Sender;
  userId: string; 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatInput({
  onSendMessage,
  scrollToEnd,
  roomId,
  sender,
  userId,
  setMessages,
}: Props) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* const {
    isRecording,
    startRecording,
    stopRecording,
    playLastRecording,
    lastRecordingUri,
  } = useVoiceInput(setMessages, roomId, sender); */

const send = () => {
  if (!input.trim()) return;
  onSendMessage(input);
  setInput('');
  scrollToEnd();
};


  /* const handleVoiceButton = () => {
    isRecording ? stopRecording() : startRecording();
  }; */

  const detectSensitiveInfo = (text: string) => {
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.regex.test(text)) {
        alert(`⚠️ ${pattern.type}가 감지되었습니다. 민감한 정보 입력을 피해주세요.`);
        break;
      }
    }
  };

  /* const activitySuggestions = [
    {
      id: '1',
      name: '2024년 낙동강정원 벚꽃축제',
      location: '낙동제방 벚꽃길 일원, 르네시떼 야외무대',
      time: '2024. 3. 29.(금) ~ 3. 31.(일)',
      category: '산책',
    },
    {
      id: '2',
      name: '2024년 낙동강정원 벚꽃축제',
      location: '낙동제방 벚꽃길 일원, 르네시떼 야외무대',
      time: '2024. 3. 29.(금) ~ 3. 31.(일)',
      category: '축제',
    },
    {
      id: '3',
      name: '시장 보기',
      location: '전통시장 입구',
      time: '내일 오전 10시',
      category: '축제',
    },
  ];*/

  return (
    <>
      {/* 활동 추천 모달 제거 */}
      {/* <Modal
        transparent
        visible={showSuggestions}
        animationType="slide"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.suggestionsBox}>
            <FlatList
              data={activitySuggestions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: SPACING.lg, paddingHorizontal: SPACING.lg }}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <View style={[styles.card, styles.shadowCard]}>
                  <View style={styles.cardTopRow}>
                    <Image source={categoryToImage[item.category]} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                  </View>
                  <Text style={styles.cardLocation}>{item.location}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal> */}

      <View style={[styles.inputRow, styles.shadowInput]}>
        {/* 활동 제안 버튼 제거 */}
        {/* <Pressable onPress={() => setShowSuggestions(true)}>
          <Image source={ActivityIcon} style={styles.sendIcon} />
        </Pressable> */}

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            detectSensitiveInfo(text);
          }}
          placeholder="메시지를 입력하세요"
          onFocus={scrollToEnd}
        />

        {/* 녹음 파일 재생 버튼 제거 */}
        {/* {lastRecordingUri && !isRecording && (
          <Pressable onPress={playLastRecording} style={styles.playButton}>
            <Image source={PlayIcon} style={styles.playIcon} />
          </Pressable>
        )} */}

        {/* 녹음 중 표시 UI 제거 */}
        {/* {isRecording ? (
          <Pressable onPress={handleVoiceButton} style={styles.recordingUI}>
            <ActivityIndicator color={COLORS.orange} />
            <Text style={styles.recordingText}>녹음 중...</Text>
          </Pressable>
        ) : ( */}
          <Pressable onPress={send}>
            <Image source={Send} style={styles.sendIcon} />
          </Pressable>
        {/* )} */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: INPUT_HEIGHT,
  },
  shadowInput: { ...SHADOWS.input },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.body,
    paddingHorizontal: SPACING.md,
  },
  sendIcon: {
    width: 24,
    height: 24,
    marginHorizontal: SPACING.sm,
  },
  recordingUI: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  recordingText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.orange,
    marginLeft: 6,
  },
  playButton: {
    marginRight: SPACING.sm,
  },
  playIcon: {
    width: 24,
    height: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  suggestionsBox: {
    height: '50%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: SPACING.lg,
  },
  card: {
    borderRadius: 30,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  shadowCard: {
    ...SHADOWS.bubble,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardImage: {
    width: 35,
    height: 35,
    borderRadius: 8,
    marginRight: SPACING.sm,
    marginStart: 10,
  },
  cardTitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  cardLocation: {
    fontSize: FONT_SIZES.body,
    color: COLORS.black,
    marginTop: 2,
    marginStart: 10,
    padding: SPACING.xs,
  },
  cardTime: {
    fontSize: FONT_SIZES.body,
    color: COLORS.black,
    marginTop: 2,
    marginStart: 10,
    padding: SPACING.xs,
  },
});
