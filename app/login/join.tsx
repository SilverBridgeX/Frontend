// screens/SignupScreen.tsx
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

const handleComplete = () => {
    // 가입 완료 처리 후
    router.replace('/home'); // 탭 내부 진입
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