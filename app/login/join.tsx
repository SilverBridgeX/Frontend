import { registerOlderByGuardian, socialLogin } from '@/api/userService';
import { COLORS } from '@/constants/theme';
import { goToHomeAndConnectSocket } from '@/lib/goToHomeAndConnectSocket';
import { useChatStore } from '@/store/chatStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const { email: emailParam, address: addressParam } = useLocalSearchParams<{
    email?: string;
    address?: string;
  }>();

  const { userRole, userName, email, isRegisteringByGuardian, setUserName, setEmail, setIsRegisteringByGuardian } = useChatStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [joinEmail, setJoinEmail] = useState('');

  useEffect(() => {
    if (emailParam) setJoinEmail(emailParam);
  }, [])

  // ✅ 주소 파라미터가 들어오면 자동 입력
  useEffect(() => {
    console.log('🪝 addressParam from route:', addressParam); // 여기가 문제
    if (addressParam) {
      setAddress(addressParam as string);
      setName(userName as string);
      setJoinEmail(email);
    }

    return () => {
      setIsRegisteringByGuardian(false);
    };
  }, [addressParam]);

  const handleComplete = async () => {
    try {
      let response;

      if (isRegisteringByGuardian) {
        response = await registerOlderByGuardian({
          role: 'OLDER',
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
        if (!joinEmail) {
          alert('이메일 정보가 없습니다.');
          return;
        }
        response = await socialLogin({
          role: userRole,
          email: joinEmail,
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
        placeholderTextColor="#666666"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>도로명 주소 입력</Text>
      <TextInput
        style={styles.input}
        placeholder="주소를 선택해주세요"
        placeholderTextColor="#666666"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          setUserName(name);
          setEmail(joinEmail);
          router.push({
            pathname: '/address',
            params: { callback: 'login/join' },
          } as any)
        }}
      >
        <Text style={styles.searchButtonText}>주소 검색하기</Text>
      </TouchableOpacity>


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
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
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