import { createSimulationRoom } from '@/api/aiService';
import { checkMatchingStatus, requestMatching } from '@/api/userService';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { chatService } from '@/api/chatService';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

const chatRooms = [
  { id: '1', name: '김순이', message: '오늘 날씨 참 좋네요 ☀️', time: '오전 9:30', avatar: 'https://i.pravatar.cc/100?u=1' },
  { id: '2', name: '박영수', message: '내일 마트 같이 가실래요?', time: '어제', avatar: 'https://i.pravatar.cc/100?u=2' },
  { id: '3', name: '이정자', message: '감사합니다! 잘 받았어요 🙏', time: '2일 전', avatar: 'https://i.pravatar.cc/100?u=3' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { userId, userName, userGender } = useChatStore();
  const [chatRooms, setChatRooms] = useState<any[]>([]);

  const [countdown, setCountdown] = useState('');
  const [buttonState, setButtonState] = useState<'idle' | 'waiting'>('waiting');

  useEffect(() => {
    checkMatchingStatus()
      .then((res) => {
        if (res === true) {
          setButtonState('idle');
          setCountdown('');
        } else {
          setButtonState('waiting');
          startMatchingTimer();
        }
      })
      .catch(() => {
        Alert.alert('오류', '매칭 상태 확인에 실패했습니다.');
        setButtonState('idle');
        setCountdown('');
      });
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await chatService.fetchChatRoomList();
        setChatRooms(rooms);
      } catch (error) {
        console.error('채팅방 목록 로딩 실패:', error);
      }
    };
    loadRooms();
  }, []);

  const handleCreateSimulationRoom = async () => {
    try {
      const response = await createSimulationRoom(Number(userId), userName, userGender);
      if (response.room_id) {
        Alert.alert('연습모드 생성 완료!', '새로운 연습방이 만들어졌어요 🎉');
      }
    } catch (error) {
      Alert.alert('생성 실패', '연습방 생성에 실패했어요 😢');
    }
  };

  const getNextTargetTime = (): Date => {
    const now = new Date();
    const currentMinutes = now.getMinutes();
    const nextTargetMinute = [0, 10, 20, 30, 40, 50].find(m => currentMinutes < m) ?? 60;

    const target = new Date(now);
    target.setMinutes(nextTargetMinute === 60 ? 0 : nextTargetMinute);
    target.setSeconds(0);
    target.setMilliseconds(0);
    if (nextTargetMinute === 60) {
      target.setHours(target.getHours() + 1);
    }

    return target;
  };

  const startMatchingTimer = () => {
    const targetTime = getNextTargetTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = targetTime.getTime() - now;

      if (remaining <= 0) {
        clearInterval(timer);

        checkMatchingStatus()
          .then(res => {
            if (res === true) {
              setButtonState('idle');
              setCountdown('');
              Alert.alert('매칭 성공!', '만남 시작하기 버튼이 활성화되었습니다 😊');
            } else {
              startMatchingTimer();
            }
          })
          .catch(() => {
            Alert.alert('오류', '매칭 상태 확인 중 오류가 발생했습니다.');
            setButtonState('idle');
            setCountdown('');
          });
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);
  };

  const handleMatchStart = () => {
    if (buttonState === 'idle') {
      requestMatching()
        .then(res => {
          if (res?.isSuccess && res.result) {
            Alert.alert('매칭 요청 성공', '매칭이 시작되었습니다 🎉');
            setButtonState('waiting'); // 👉 상태를 waiting으로 변경
            startMatchingTimer();      // 👉 타이머 시작
          } else {
            Alert.alert('매칭 요청 실패', '다시 시도해주세요.');
          }
        })
        .catch(() => {
          Alert.alert('오류', '매칭 요청 중 오류가 발생했습니다.');
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>은빛 동행</Text>
      </View>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: COLORS.lightLemon }]}
        onPress={handleMatchStart}
        disabled={buttonState !== 'idle'}
      >
        <Text style={styles.startButtonText}>
          {buttonState === 'idle' ? '만남 시작하기' : `매칭까지 ${countdown}`}
        </Text>
      </TouchableOpacity>

      {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 채팅</Text>
        <TouchableOpacity style={styles.simulationButton} onPress={handleCreateSimulationRoom}>
          <Text style={styles.simulationButtonText}>연습모드방 만들기</Text>
        </TouchableOpacity>
      </View> */}

      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const latest = item.latestMessage;
          const participant = item.participants?.[0]?.name ?? '알 수 없음';
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                router.push({
                  pathname: '/chat/[roomId]',
                  params: {
                    roomId: item._id,
                    isSimulation: item.isSimulation?.toString(), // boolean → string 변환 필요
                  },
                })
              }}
            >
              <Image source={{ uri: 'https://i.pravatar.cc/100?u=' + item._id }} style={styles.avatar2} />
              <View style={styles.info}>
                <Text style={styles.name}>{participant}</Text>
                <Text style={styles.message} numberOfLines={1}>{latest?.content ?? '메시지 없음'}</Text>
              </View>
              <Text style={styles.time}>
                {latest?.createdAt ? new Date(latest.createdAt).toLocaleDateString() : ''}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  appBar: {
    height: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: SPACING.lg,
  },
  appBarTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.orange,
    ...(SHADOWS.bubble),
  },
  content: {
    padding: SPACING.md,
  },
  startButton: {
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginHorizontal: 30,
    alignSelf: 'stretch',
    ...SHADOWS.bubble,
  },
  startButtonText: {
    fontSize: FONT_SIZES.title + 4,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    marginTop: 0,
    lineHeight: FONT_SIZES.title + 4,
  },
  chatRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: FONT_SIZES.body,
  },
  chatMessage: {
    color: COLORS.black,
    marginTop: 2,
  },
  chatTime: {
    color: COLORS.black,
    fontSize: FONT_SIZES.xsmall,
  },
  simulationButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.large,
    marginLeft: 'auto',
    justifyContent: 'center',
    ...SHADOWS.bubble,
  },
  simulationButtonText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: COLORS.white,
  },
  avatar2: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    marginRight: SPACING.md,
  },
  info: { flex: 1 },
  name: {
    fontWeight: 'bold',
    fontSize: FONT_SIZES.title,
  },
  message: {
    color: COLORS.black,
    fontSize: FONT_SIZES.small,
  },
  time: {
    color: COLORS.black,
    fontSize: FONT_SIZES.xsmall,
    marginLeft: SPACING.sm,
  },
});
