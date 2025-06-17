import { getGuardianMyPage } from '@/api/userService';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet, Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeGuardianScreen() {
  const router = useRouter();
  const { setIsRegisteringByGuardian } = useChatStore();
  const [olderList, setOlderList] = useState<{ nickname: string; key: string }[]>([]);
  const { setKey } = useChatStore();

    // ✅ 보호자 마이페이지 데이터 불러오기
  useEffect(() => {
    const fetchOlderList = async () => {
      try {
        const res = await getGuardianMyPage();
        setOlderList(res.result.olderInfoDtos || []);
      } catch (error) {
        Alert.alert('오류', '동행자 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchOlderList();
  }, []);

  //동행자 등록하기
  const handleRegisterOlder = () => {   
    setIsRegisteringByGuardian(true); // ✅ flag ON
    router.push('/login/join');       // ✅ join으로 이동
  };
  //동행자 연결하기 
  const handleLinkOlder = () => {
    router.push('/link');
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>은빛 동행</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRegisterOlder}>
          <Text style={styles.actionText}>동행자 등록하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLinkOlder}>
          <Text style={styles.actionText}>동행자 연결하기</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>연결된 동행자</Text>
        <ScrollView style={styles.listContainer}>
          {olderList.map((older, index) => (
            <View key={index} style={styles.olderItem}>
              <Image
                source={{ uri: 'https://via.placeholder.com/40' }}
                style={styles.profileImage}
              />
              <View style={styles.olderInfo}>
                <Text style={styles.nickname}>{older.nickname}</Text>
                <Text style={styles.key}>{"KEY : "+older.key}</Text>
              </View>

              <TouchableOpacity
                style={styles.payButton}
                  onPress={() => {
                    setKey(older.key);        // ✅ 선택한 동행자 key 저장
                    router.push('/payment');       // ✅ 결제 화면으로 이동
                  }}              
              >
                <Text style={styles.payButtonText}>결제하기</Text>
              </TouchableOpacity>

            </View>
          ))}
        </ScrollView>
      </View>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: 40,
    flex: 1,
  },
  actionButton: {
    backgroundColor: COLORS.lightLemon,
    paddingVertical: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.bubble,
  },
  actionText: {
    fontSize: FONT_SIZES.title + 4,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    marginTop: 16,
  },
  listContainer: {
    flex: 1,
  },
  olderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  olderInfo: {
    flex: 1
  },
  nickname: {
    fontSize: FONT_SIZES.body,
    fontWeight: 'bold',
    padding: 5,
  },
  key: {
    fontSize: FONT_SIZES.body,
    color: COLORS.gray,
    padding: 5,
  },
  payButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.medium,
  },
  payButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.small,
    padding: 5
  },
});