// screens/SignupScreen.tsx
import { registerOlderByGuardian, socialLogin } from '@/api/userService';
import { COLORS } from '@/constants/theme';
import { goToHomeAndConnectSocket } from '@/lib/goToHomeAndConnectSocket';
import { useChatStore } from '@/store/chatStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const { email: emailParam} = useLocalSearchParams<{
    email?: string;
  }>();

  const { userRole, isRegisteringByGuardian, setIsRegisteringByGuardian} = useChatStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    return () => {
      setIsRegisteringByGuardian(false); // ✅ 화면 벗어날 때 초기화
    };
  }, []);  

  const handleComplete = async () => {

    try {

      let response;

      if (isRegisteringByGuardian) {
        response = await registerOlderByGuardian({
          email: 'test',
          nickname: name,
          streetAddress: address,
        });

        if (response.isSuccess) {
          console.log('동행자 등록 성공! accessToken:', response.result.accessToken);
          router.replace('/home');

          alert('동행자 등록 성공! 홈 화면으로 이동합니다.');
        } else {
          router.replace('/home');
          alert('동행자 등록 실패: ' + response.message);
        }
      } else {
        if (!emailParam) {
          alert('이메일 정보가 없습니다.');
          return;
        }
        response = await socialLogin({
          role: userRole,
          email: emailParam,
          nickname: name,
          streetAddress: address,
        });

        if (response.isSuccess) {
          console.log('회원가입 성공! accessToken:', response.result.accessToken);
          await goToHomeAndConnectSocket();
          router.replace('/home');

          alert('회원가입 성공! 홈 화면으로 이동합니다.');
        } else {
          router.replace('/login');
          alert('회원가입 실패: ' + response.message);
        }
      }

    } catch (error) {
      alert('에러 발생: ' + error);
    } 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="닉네임을 입력해주세요"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>도로명 주소 입력</Text>
      <TextInput
        style={styles.input}
        placeholder="주소 검색"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleComplete}>
        <Text style={styles.submitButtonText}>완료</Text>
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
  label: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});