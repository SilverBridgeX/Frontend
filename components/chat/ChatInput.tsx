// components/chat/ChatInput.tsx
import { COLORS, FONT_SIZES, INPUT_HEIGHT, SHADOWS, SPACING } from '@/constants/theme';
import { Message } from '@/types/message';
import React, { useState } from 'react';
import { Image, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import useVoiceInput from './useVoiceInput';

const Send = require("../../assets/images/btn_send.png");
const MicIcon = require("../../assets/images/img_mike.png");

interface Props {
  onSendMessage: React.Dispatch<React.SetStateAction<Message[]>>;
  scrollToEnd: () => void;
}

export default function ChatInput({ onSendMessage, scrollToEnd }: Props) {
  const [input, setInput] = useState('');
  const { startVoiceInput } = useVoiceInput(onSendMessage);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
    };
    onSendMessage(prev => [...prev, newMsg]);
    setInput('');
    Keyboard.dismiss();
    scrollToEnd();
  };

  return (
      <View style={[styles.inputRow, styles.shadowInput]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요"
          onFocus={scrollToEnd}
        />
        <Pressable onPress={input.trim() ? send : startVoiceInput}>
          <Image source={input.trim() ? Send : MicIcon} style={styles.sendIcon} />
        </Pressable>
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
});
