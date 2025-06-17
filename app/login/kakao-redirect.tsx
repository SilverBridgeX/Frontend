// ✅ app/kakao/KakaoLoginRedirect.tsx
import { kakaoLoginWithCode, socialShortLogin } from '@/api/userService';
import { goToHomeAndConnectSocket } from '@/lib/goToHomeAndConnectSocket';
import { useChatStore } from '@/store/chatStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

export default function KakaoLoginRedirect() {
  const { token} = useLocalSearchParams();
  const {userRole} = useChatStore()

  useEffect(() => {
    const handleKakaoLogin = async () => {

      try {

        console.log('🔑 전달받은 인가 코드:', token);
        const response = await kakaoLoginWithCode(token as string);

        console.log(response.result);

        const { email, user } = response.result;

        if (user === false) {
          router.replace({
            pathname: '/login/join',
            params: { email}, // 회원가입은 여전히 role 필요
          });
        } else {

          let response = await socialShortLogin({
            role: userRole,
            email: email,
          });

          if (response.isSuccess) {
            console.log('로그인 성공! accessToken:', response.result.accessToken);
            await goToHomeAndConnectSocket();
            router.replace('/home');

            alert('로그인 성공! 홈 화면으로 이동합니다.');
          } else {
            router.replace('/login');
            alert('로그인 실패: ' + response.message);
          }    

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
