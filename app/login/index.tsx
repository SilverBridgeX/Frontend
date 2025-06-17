// screens/LoginScreen.tsx
import { loginWithKey } from '@/api/userService'; // 로그인 API 호출 함수
import { COLORS, SHADOWS } from '@/constants/theme';
import { ROLE } from '@/constants/user';
import { goToHomeAndConnectSocket } from '@/lib/goToHomeAndConnectSocket';
import { useChatStore } from '@/store/chatStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [id, setId] = useState('');
  const [role, setRole] = useState(ROLE.OLDER); // 기본 역할을 '동행자'로 설정
  const { setUserRole } = useChatStore();

  const handleLogin = async () => {
    if (!id.trim()) {
      alert('ID를 입력해주세요!');
      return;
    }

    try {
      const response = await loginWithKey(id.trim());

      if (response.isSuccess) {
        console.log('✅ 로그인 성공:', response.result);

        // 예: 토큰 저장 (AsyncStorage 등으로)
        // await AsyncStorage.setItem('accessToken', response.result.accessToken);
        setUserRole(role) // ✅ 전역 저장
        await goToHomeAndConnectSocket();
        router.push('/home');
      } else {
        alert(`로그인 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인 중 오류가 발생했어요!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>은빛 동행</Text>

      {/* 간격 추가 */}
      <View style={{ height: 80 }} />

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === ROLE.OLDER && styles.activeRole,
          ]}
          onPress={() => setRole(ROLE.OLDER)}
        >
          <Text
            style={role === ROLE.OLDER ? styles.activeRoleText : styles.roleText}
          >
            동행자
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === ROLE.OLDER_PROTECTER && styles.activeRole,
          ]}
          onPress={() => setRole(ROLE.OLDER_PROTECTER)}
        >
          <Text
            style={role === ROLE.OLDER_PROTECTER ? styles.activeRoleText : styles.roleText}
          >
            보호자
          </Text>
        </TouchableOpacity>
      </View>


      {role === ROLE.OLDER && (
        <>
          <TextInput
            style={styles.input}
            placeholder="ID를 입력해주세요"
            placeholderTextColor="#666666"
            value={id}
            onChangeText={setId}
          />

          <TouchableOpacity onPress={
              handleLogin
            } style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

        </>
      )}

      <TouchableOpacity
        onPress={() =>{
          console.log('카카오 버튼 클릭됨')
          setUserRole(role); // ✅ 전역 저장
          router.push({
            pathname: '/login/kakao-login'
          })
        }}
        style={styles.kakaoButton}
      >
        <Image
          source={require('../../assets/images/kakao_login_large_wide.png')}
          style={styles.kakaoIcon}
        />
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
  signupContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },

  signupText: {
    color: COLORS.orange,
    fontSize: 14,
    fontWeight: 'bold',
  },

});