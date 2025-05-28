// components/chat/ChatList.tsx
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Message } from '@/types/message';
import * as Speech from 'expo-speech';
import React, { forwardRef } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const DefaultAvatar = require("../../assets/images/img_profile.png");
const AIAvatar = require("../../assets/images/img_ai.png");

interface Props {
  messages: Message[];
}

const ChatList = forwardRef<FlatList, Props>(({ messages }, ref) => {
  const handleSpeak = (text: string) => {
    Speech.speak(text, {
      language: 'ko',
      rate: 1.0,
      pitch: 1.0,
    });
  };

return (
  <FlatList
    ref={ref}
    data={messages}
    keyExtractor={item => item.id}
    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
    renderItem={({ item }) => (
      <View style={{ marginBottom: 12 }}> 
        {item.fromMe ? (
          <Pressable onPress={() => handleSpeak(item.text)}>
            <View style={[styles.bubble, styles.myBubble]}>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </Pressable>
        ) : item.isAI ? (
          <>
            <View style={styles.row}>
              <Image source={AIAvatar} style={styles.aiAvatar} />
              <Text style={styles.name}>{item.name || 'AI'}</Text>
            </View>
            <Pressable onPress={() => handleSpeak(item.text)}>
              <View style={[styles.bubble, styles.aiBubble]}>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Image source={item.avatar || DefaultAvatar} style={styles.avatar} />
              <Text style={styles.name}>{item.name || '사용자'}</Text>
            </View>
            <Pressable onPress={() => handleSpeak(item.text)}>
              <View style={[styles.bubble, styles.otherBubble]}>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </Pressable>
          </>
        )}
      </View>
    )}
  />
);


});

export default ChatList;

const styles = StyleSheet.create({
  bubble: {
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.large,
  },
  myBubble: {
    backgroundColor: COLORS.lemon,
    alignSelf: 'flex-end',
    maxWidth: '50%',
  },
  otherBubble: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    maxWidth: Dimensions.get('window').width * 0.5,
    ...SHADOWS.bubble,
    marginLeft: 32,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightLemon, // 예시로 연한 레몬색 (AI 전용 색상)
    maxWidth: Dimensions.get('window').width * 0.8,
    ...SHADOWS.bubble,
    marginLeft: 32,
  },
  text: { color: COLORS.black },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  aiAvatar: { width: 32, height: 32, marginRight: 8 },
  name: { fontSize: FONT_SIZES.small, fontWeight: 'bold', color: COLORS.black },
});
