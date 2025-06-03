import { createSimulationRoom } from '@/api/aiService'; // ✅ 연습방 API import
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const chatRooms = [
  { id: '1', name: '김순이', message: '오늘 날씨 참 좋네요 ☀️', time: '오전 9:30', avatar: 'https://i.pravatar.cc/100?u=1' },
  { id: '2', name: '박영수', message: '내일 마트 같이 가실래요?', time: '어제', avatar: 'https://i.pravatar.cc/100?u=2' },
  { id: '3', name: '이정자', message: '감사합니다! 잘 받았어요 🙏', time: '2일 전', avatar: 'https://i.pravatar.cc/100?u=3' },
];

export default function HomeScreen() {
  const router = useRouter();

  const {
    userId,
    userName,
    userGender
  } = useChatStore();

  const handleCreateSimulationRoom = async () => {
    try {
      const response = await createSimulationRoom(Number(userId), userName, userGender);
      if (response.room_id) {
        Alert.alert('연습모드 생성 완료!', '새로운 연습방이 만들어졌어요 🎉');
        // router.push(`/chat/${response.room_id}`); // 자동 입장 원하면 주석 해제
      }
    } catch (error) {
      Alert.alert('생성 실패', '연습방 생성에 실패했어요 😢');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>은빛 동행</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.startButton} onPress={() => router.push('/match')}>
          <Text style={styles.startButtonText}>만남 시작하기</Text>
        </TouchableOpacity>

      {/* 최근 채팅 제목 + 연습모드방 만들기 버튼 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 채팅</Text>

        <TouchableOpacity style={styles.simulationButton} onPress={handleCreateSimulationRoom}>
          <Text style={styles.simulationButtonText}>연습모드방 만들기</Text>
        </TouchableOpacity>
      </View>


        {chatRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.chatRoom}
            onPress={() => router.push(`/chat/${room.id}`)}
          >
            <Image source={{ uri: room.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{room.name}</Text>
              <Text style={styles.chatMessage}>{room.message}</Text>
            </View>
            <Text style={styles.chatTime}>{room.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    justifyContent: 'center',      // 수직 중앙 정렬
    alignItems: 'flex-start',      // 왼쪽 정렬
    paddingTop: 0,                 // 필요시 0 또는 원하는 값
    paddingLeft: SPACING.lg,  
  },
  appBarTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.orange,
    // 그림자 효과 추가 (theme의 SHADOWS.text 사용)
    ...(SHADOWS.bubble),
  },
  content: {
    padding: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.lightLemon,
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginHorizontal: 30,         // 좌우 30씩 여백
    alignSelf: 'stretch',         // 부모(View)의 가로를 기준으로 늘림
    ...SHADOWS.bubble,
  },
  startButtonText: {
    fontSize: FONT_SIZES.title + 4,   // 글씨 더 크게
    color: COLORS.black,
    fontWeight: 'bold',               // 볼드 처리
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    // marginBottom 제거
    marginTop: 0, // sectionHeader 내부에서 수직 정렬로 대체
    lineHeight: FONT_SIZES.title + 4, // 세로 중앙에 텍스트 자연스럽게 정렬
  },
  chatRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    // borderBottomWidth: 1,           // 구분선 제거
    // borderBottomColor: COLORS.black // 구분선 제거
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
    paddingVertical: 8,        // 높이 키움
    paddingHorizontal: 16,     // 너비 키움
    borderRadius: RADIUS.large,
    marginLeft: 'auto',        // 오른쪽 정렬
    justifyContent: 'center',  // 버튼 안 텍스트 수직 가운데
    ...SHADOWS.bubble,
  },
  simulationButtonText: {
    fontSize: FONT_SIZES.small,  // 기존 xsmall → small로 키움
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',        // 텍스트와 버튼 모두 수직 정렬
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.md,
  }

});
