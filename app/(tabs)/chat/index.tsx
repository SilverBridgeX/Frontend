import AppBar from '@/components/AppBar';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const chatRooms = [
  { id: '1', name: '김순이', message: '오늘 날씨 참 좋네요 ☀️', time: '오전 9:30', avatar: 'https://i.pravatar.cc/100?u=1' },
  { id: '2', name: '박영수', message: '내일 마트 같이 가실래요?', time: '어제', avatar: 'https://i.pravatar.cc/100?u=2' },
  { id: '3', name: '이정자', message: '감사합니다! 잘 받았어요 🙏', time: '2일 전', avatar: 'https://i.pravatar.cc/100?u=3' },
];

export default function ChatList() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <AppBar title="채팅" />
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
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
    fontSize: FONT_SIZES.body,
  },
  time: {
    color: COLORS.black,
    fontSize: FONT_SIZES.xsmall,
    marginLeft: SPACING.sm,
  },
});