// screens/LoginScreen.tsx
import { COLORS, SHADOWS } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [id, setId] = useState('');

const handleLogin = () => {
    // 로그인 로직 (예: ID 확인)
    router.push('/login/join');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>은빛 동행</Text>

      {/* 간격 추가 */}
      <View style={{ height: 80 }} />

      <View style={styles.roleContainer}>
        <TouchableOpacity style={[styles.roleButton, styles.activeRole]}>
          <Text style={styles.activeRoleText}>노인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton}>
          <Text style={styles.roleText}>보호자</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="ID를 입력해주세요"
        value={id}
        onChangeText={setId}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.kakaoButton}>
        <Image source={require('../../assets/images/kakao_login_large_wide.png')} style={styles.kakaoIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.orange,
    // 그림자 효과 추가 (theme의 SHADOWS.text 사용)
    ...(SHADOWS.bubble),
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    width: '40%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
  },
  activeRole: {
    backgroundColor: COLORS.orange,
  },
  activeRoleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roleText: {
    color: COLORS.black,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: COLORS.orange,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#fee500',
    borderRadius: 5,
    width: '100%',
  },
  kakaoIcon: {
    width: '100%',
    height: 24,
    marginRight: 10,
  },
  kakaoText: {
    color: '#000',
    fontWeight: 'bold',
  },
});