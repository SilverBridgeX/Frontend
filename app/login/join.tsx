// screens/SignupScreen.tsx
import { socialLogin } from '@/api/userService';
import { COLORS } from '@/constants/theme';
import { EMAIL, ROLE } from '@/constants/user';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialRole = params.role === ROLE.OLDER_PROTECTER ? ROLE.OLDER_PROTECTER : ROLE.OLDER;
  const [role, setRole] = useState(initialRole);

  const handleComplete = async () => {
    try {
        const response = await socialLogin({
        role,
        email: EMAIL,
        nickname: name,
        streetAddress: address,
        });

        if (response.isSuccess) {
        // ✅ 토큰 저장 로직 (선택)
        console.log('회원가입 성공! accessToken:', response.result.accessToken);
        // 예: await AsyncStorage.setItem('accessToken', response.result.accessToken);

        router.replace('/login'); // 회원가입 후 로그인 화면으로 이동
        alert('회원가입 성공! 로그인 화면으로 이동합니다.');

        } else {
        alert('로그인 실패: ' + response.message);
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