import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeGuardianScreen() {
  const router = useRouter();
  const { setIsRegisteringByGuardian } = useChatStore();
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
});
