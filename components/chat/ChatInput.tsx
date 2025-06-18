import { getRecommendedActivities } from '@/api/userService';
import { COLORS, FONT_SIZES, INPUT_HEIGHT, SHADOWS, SPACING } from '@/constants/theme';
import { Message, Sender } from '@/types/chat';
import React, { useEffect, useState } from 'react';

import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const Send = require('../../assets/images/btn_send.png');
const ActivityIcon = require('../../assets/images/icon_activity.png');

// 민감 정보 정규표현식
const SENSITIVE_PATTERNS = [
  { type: '휴대폰 번호', regex: /01[016789]-?\d{3,4}-?\d{4}/ },
  { type: '주민등록번호', regex: /\d{6}-?[1-4]\d{6}/ },
  { type: '이메일 주소', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ },
  { type: '신용카드 번호', regex: /\b(?:\d[ -]*?){13,16}\b/ },
  { type: '계좌번호', regex: /\d{2,3}-\d{2,6}-\d{6,8}/ },
];

// 활동 태그에 따라 이미지 맵핑
const categoryToImage: Record<string, any> = {
  TOUR_SPOT: require('../../assets/images/activity_walk.png'),
  FESTIVAL: require('../../assets/images/activity_festival.png'),
};

// ✅ 활동 제안 타입 정의
interface ActivitySuggestion {
  id: string;
  name: string;
  location: string;
  time: string;
  category: string;
}

interface Props {
  onFocus: (content: string) => void;
  onSendMessage: (content: string) => void;
  scrollToEnd: () => void;
  roomId: string;
  sender: Sender;
  userId: string;
  prefillMessage: string | null;
  onPrefillHandled: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatInput({
  onFocus,
  onSendMessage,
  scrollToEnd,
  roomId,
  sender,
  userId,
  setMessages,
  prefillMessage,
  onPrefillHandled,
}: Props) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  // ✅ activitySuggestions에 타입 명시
  const [activitySuggestions, setActivitySuggestions] = useState<ActivitySuggestion[]>([]);

  useEffect(() => {
    if (prefillMessage && !hasPrefilled) {
      setInput(prefillMessage);
      setHasPrefilled(true);
      onPrefillHandled();
    }
  }, [prefillMessage, hasPrefilled]);

  useEffect(() => {
    if (showSuggestions) {
      getRecommendedActivities()
        .then((data) => {
          const mapped = data.map((item: any, index: number) => ({
            id: index.toString(),
            name: item.name,
            location: item.content,
            time: item.address,
            category: item.tag,
          }));
          setActivitySuggestions(mapped);
        })
        .catch((error) => {
          console.error('추천 활동 불러오기 실패:', error);
        });
    }
  }, [showSuggestions]);

  const send = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    setHasPrefilled(false);
    scrollToEnd();
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
    <>
      <Modal
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
              contentContainerStyle={{
                paddingVertical: SPACING.lg,
                paddingHorizontal: SPACING.lg,
              }}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    const message = `[${item.category}] ${item.name}\n장소: ${item.location}\n시간: ${item.time}`;
                    onSendMessage(message);
                    setShowSuggestions(false); // 모달 닫기
                    scrollToEnd(); // 스크롤 아래로
                  }}
                >
                  <View style={[styles.card, styles.shadowCard]}>
                    <View style={styles.cardTopRow}>
                      <Image
                        source={categoryToImage[item.category] ?? ActivityIcon}
                        style={styles.cardImage}
                      />
                      <Text style={styles.cardTitle}>{item.name}</Text>
                    </View>
                    <Text style={styles.cardLocation}>{item.location}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                </Pressable>

              )}
            />
          </View>
        </View>
      </Modal>

      <View style={[styles.inputRow, styles.shadowInput]}>
        <Pressable onPress={() => setShowSuggestions(true)}>
          <Image source={ActivityIcon} style={styles.sendIcon} />
        </Pressable>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => {
            setInput(text);
            detectSensitiveInfo(text);
          }}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#666666"
          onFocus={() => {
            scrollToEnd();     // 기존 동작 유지
            onFocus(input);    // ✅ 부모에서 전달한 onFocus도 호출
          }}
        />

        <Pressable onPress={send}>
          <Image source={Send} style={styles.sendIcon} />
        </Pressable>
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
