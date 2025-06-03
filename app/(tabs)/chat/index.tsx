import { chatService } from '@/api/chatService';
import AppBar from '@/components/AppBar';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const chatRooms = [
  { id: '1', name: '김순이', message: '오늘 날씨 참 좋네요 ☀️', time: '오전 9:30', avatar: 'https://i.pravatar.cc/100?u=1' },
  { id: '2', name: '박영수', message: '내일 마트 같이 가실래요?', time: '어제', avatar: 'https://i.pravatar.cc/100?u=2' },
  { id: '3', name: '이정자', message: '감사합니다! 잘 받았어요 🙏', time: '2일 전', avatar: 'https://i.pravatar.cc/100?u=3' },
];

export default function ChatList() {
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const { userId } = useChatStore();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const rooms = await chatService.fetchChatRoomList(userId);
        setChatRooms(rooms);
      } catch (error) {
        console.error('채팅방 목록 로딩 실패:', error);
      }
    };
    loadRooms();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <AppBar title="채팅" />
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const latest = item.latestMessage;
          const participant = item.participants?.[0]?.name ?? '알 수 없음';
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: '/chat/[roomId]',
                  params: {
                    roomId: item._id,
                    isSimulation: item.isSimulation?.toString(), // boolean → string 변환 필요
                  },
                })
              }
            >
              <Image source={{ uri: 'https://i.pravatar.cc/100?u=' + item._id }} style={styles.avatar} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  avatar: {
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