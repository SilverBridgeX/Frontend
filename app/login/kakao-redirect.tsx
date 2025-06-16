// ✅ app/kakao/KakaoLoginRedirect.tsx
import { kakaoLoginWithCode } from '@/api/userService';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

export default function KakaoLoginRedirect() {
  const { token, role } = useLocalSearchParams();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      try {
        console.log('🔑 전달받은 인가 코드:', token);
        const response = await kakaoLoginWithCode(token as string);

        const { user, email } = response.result;

        if (user === false) {
          // 회원가입 화면으로 이동하며 이메일 전달
          router.replace({
            pathname: '/login/join',
            params: {
              email,
              role, 
            },
          });
        } else {
          // 이미 가입된 유저 → 홈으로 이동
          router.replace('/home');
        }
      } catch (err) {
        console.error('카카오 로그인 실패:', err);
      }
    };

    if (token) {
      handleKakaoLogin();
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}
