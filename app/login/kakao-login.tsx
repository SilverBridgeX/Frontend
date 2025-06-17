import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const REACT_APP_CLIENT_ID = 'd404716d7ca4c244cb4cdc619e77c236';
const REACT_APP_REDIRECT_URI = 'http://15.165.17.95';

export default function KakaoLoginWebview() {
  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight = Dimensions.get("window").height;

  const isHandled = useRef(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        style={{ width: deviceWidth, height: deviceHeight }}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URI}&response_type=code&prompt=login`,
        }}
        onNavigationStateChange={(e) => {
          if (!isHandled.current && e.url.includes('code=')) {
            isHandled.current = true; // ✅ 한 번만 처리하도록 막기
            console.log("✅ 카카오 로그인 인가코드 감지됨");
            const code = e.url.split('code=')[1];
            router.push({
              pathname: '/login/kakao-redirect',
              params: { token: code },
            });
          }
        }}
      />
    </SafeAreaView>
  );
}
