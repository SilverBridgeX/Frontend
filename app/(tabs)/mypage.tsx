import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuItem = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={COLORS.orange} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

export default function MyPageScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* 앱바 */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>마이페이지</Text>
      </View>

      {/* 사용자 정보 카드 */}
      <View style={styles.profileCard}>
        <Image source={{ uri: 'https://i.pravatar.cc/100?u=1' }} style={styles.avatar} />
        <Text style={styles.name}>이순자</Text>
        <Text style={styles.email}>lee@example.com</Text>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        <MenuItem icon="person-outline" label="프로필 수정" onPress={() => {}} />
        <MenuItem icon="notifications-outline" label="알림 설정" onPress={() => {}} />
        <MenuItem icon="chatbubble-ellipses-outline" label="1:1 문의" onPress={() => {}} />
        <MenuItem icon="log-out-outline" label="로그아웃" onPress={() => {}} />
      </View>
    </ScrollView>
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
    marginBottom: 4,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  email: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  menuLabel: {
    fontSize: FONT_SIZES.body,
    marginLeft: SPACING.md,
    color: COLORS.black,
  },
});
