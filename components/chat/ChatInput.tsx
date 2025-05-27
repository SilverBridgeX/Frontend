import { COLORS, FONT_SIZES, INPUT_HEIGHT, SHADOWS, SPACING } from '@/constants/theme';
import { Message } from '@/types/message';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import useVoiceInput from './useVoiceInput';

const Send = require('../../assets/images/btn_send.png');
const MicIcon = require('../../assets/images/img_mike.png');
const PlayIcon = require('../../assets/images/icon_play.png'); // ▶ 아이콘 파일 필요

const SENSITIVE_PATTERNS = [
  { type: '휴대폰 번호', regex: /01[016789]-?\d{3,4}-?\d{4}/ },
  { type: '주민등록번호', regex: /\d{6}-?[1-4]\d{6}/ },
  { type: '이메일 주소', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { type: '신용카드 번호', regex: /\b(?:\d[ -]*?){13,16}\b/ },
  { type: '계좌번호', regex: /\d{2,3}-\d{2,6}-\d{6,8}/ },
];


interface Props {
  onSendMessage: (message: Message) => void;
  scrollToEnd: () => void;
}

export default function ChatInput({ onSendMessage, scrollToEnd }: Props) {
  const [input, setInput] = useState('');
  const {
    isRecording,
    startRecording,
    stopRecording,
    playLastRecording,
    lastRecordingUri,
    // 🔒 추후 STT 서버 전송 로직 사용 시 주석 해제
  //} = useVoiceInput(onSendMessage);
    } = useVoiceInput();
  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
    };
    onSendMessage(newMsg);
    setInput('');
    Keyboard.dismiss();
    scrollToEnd();
  };

  const handleVoiceButton = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const detectSensitiveInfo = (text: string) => {
  for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.regex.test(text)) {
        alert(`⚠️ ${pattern.type}가 감지되었습니다. 민감한 정보 입력을 피해주세요.`);
        break;
      }
    }
  };


  return (
    <View style={[styles.inputRow, styles.shadowInput]}>
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

      {lastRecordingUri && !isRecording && (
        <Pressable onPress={playLastRecording} style={styles.playButton}>
          <Image source={PlayIcon} style={styles.playIcon} />
        </Pressable>
      )}

      {isRecording ? (
        <Pressable onPress={handleVoiceButton} style={styles.recordingUI}>
          <ActivityIndicator color={COLORS.orange} />
          <Text style={styles.recordingText}>녹음 중...</Text>
        </Pressable>
      ) : (
        <Pressable onPress={input.trim() ? send : handleVoiceButton}>
          <Image source={input.trim() ? Send : MicIcon} style={styles.sendIcon} />
        </Pressable>
      )}
    </View>
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
    marginLeft: SPACING.sm,
  },
  recordingUI: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
});
