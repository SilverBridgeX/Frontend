import { useNavigation } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const INPUT_HEIGHT = 56;

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
}

export default function ChatRoom() {
  const navigation = useNavigation();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요!', fromMe: false },
    { id: '2', text: '반가워요~', fromMe: true },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 1) 진입 시 탭 바 숨기기, 2) 나갈 때 복구
  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
      listRef.current?.scrollToEnd({ animated: true });
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      fromMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const listPaddingBottom = INPUT_HEIGHT + keyboardHeight;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `방 ${roomId}` }} />

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 8,
          paddingBottom: listPaddingBottom,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.fromMe ? styles.myBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />

      <View
        style={{
          position: 'absolute',
          bottom: keyboardHeight,
          left: 0,
          right: 0,
        }}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { height: INPUT_HEIGHT - 16 }]}
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            onFocus={() => listRef.current?.scrollToEnd({ animated: true })}
          />
          <Pressable onPress={send} style={styles.sendButton}>
            <Text style={styles.sendText}>전송</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bubble: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#3b82f6',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#888',
    alignSelf: 'flex-start',
  },
  bubbleText: { color: '#fff' },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    height: INPUT_HEIGHT,
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
