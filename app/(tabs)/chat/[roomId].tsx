import AppBar from '@/components/AppBar';
import { COLORS, FONT_SIZES, INPUT_HEIGHT, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList, Image, Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const Send = require("../../../assets/images/btn_send.png");
const DefaultAvatar = require("../../../assets/images/img_profile.png");

interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  name?: string;      // 상대 이름
  avatar?: any;       // 상대 프로필 이미지
}

export default function ChatRoom() {
  const navigation = useNavigation();
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '안녕하세요!', fromMe: false, name: '상대방', avatar: DefaultAvatar },
    { id: '2', text: '반가워요~', fromMe: true },
    { id: '3', text: '안녕하세요!', fromMe: false, name: '상대방', avatar: DefaultAvatar },
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
      <AppBar title="채팅" />
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
          item.fromMe ? (
            <View style={[styles.bubble, styles.myBubble]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          ) : (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xs }}>
                <Image source={item.avatar || DefaultAvatar} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
              <View style={[styles.bubble, styles.otherBubble, styles.shadowBubble, { marginLeft: 32 }]}>
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
            </View>
          )
        )}
      />
      
      <View style={[styles.inputWrapper, { bottom: keyboardHeight }]}>
        <View style={[styles.inputRow, styles.shadowInput]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            onFocus={() => listRef.current?.scrollToEnd({ animated: true })}
          />
          <Pressable onPress={send}>
            <Image source={Send} style={styles.sendIcon} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  bubble: {
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.medium,
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
  },
  bubbleText: { color: COLORS.black },
    shadowBubble: {
      ...SHADOWS.bubble
  },
  inputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    height: INPUT_HEIGHT,
  },
  shadowInput: {
    ...SHADOWS.input
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.body,
  },
  sendButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.full,
  },
  sendIcon: {
    width: 24,
    height: 24,
    marginLeft: SPACING.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: FONT_SIZES.small,
    color: COLORS.black,
    fontWeight: 'bold',
    marginLeft: 2,
    marginBottom: 2,
    maxWidth: 120,
  }
});

