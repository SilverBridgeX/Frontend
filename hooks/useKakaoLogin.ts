// hooks/useKakaoLogin.ts
import axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';

const REST_API_KEY = 'd404716d7ca4c244cb4cdc619e77c236';

// ✅ 프록시 사용 리디렉션 URI 생성
const REDIRECT_URI = 'https://auth.expo.io/@clara0830/SilverAccompany';

const discovery = {
  authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
  tokenEndpoint: 'https://kauth.kakao.com/oauth/token',
};

export const useKakaoLogin = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: REST_API_KEY,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  const loginWithKakao = async () => {
    const result = await promptAsync();

    if (result.type !== 'success' || !result.params.code) {
      throw new Error('카카오 로그인 실패');
    }

    const code = result.params.code;

    // 🔐 토큰 요청
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // 📧 사용자 정보 요청
    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const email = userRes.data.kakao_account.email;
    console.log('📧 이메일:', email);

    // ✅ 로그인 완료 → 앱 내 이동
    router.push('/home');
  };

  return { loginWithKakao, request };
};
