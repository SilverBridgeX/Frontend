import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

export default function KakaoLoginRedirect() {
  const { token } = useLocalSearchParams();

  useEffect(() => {
    if (token) {
      console.log('🔑 전달받은 인가 코드:', token);
      axios
        .get(`https://15.165.17.95/v1/auth/kakao/idtoken?code=${token}`)
        .then((res) => {
          const idToken = res.data.data.idToken;
          return axios.post(`https://15.165.17.95/v1/auth/kakao/login?idtoken=${idToken}`);
        })
        .then((loginRes) => {
          const jwt = loginRes.data.token;
          // 🔑 저장하고 홈으로 이동
          console.log('로그인 성공:', jwt);
          router.replace('/home');
        })
        .catch((err) => {
          console.error('카카오 로그인 실패:', err);
        });
    }
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}
