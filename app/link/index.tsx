import { linkOlderToGuardian } from '@/api/userService';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function GuardianLinkScreen() {
  const [olderKey, setOlderKey] = useState('');
  const router = useRouter();

  const handleLink = async () => {
    try {
      const res = await linkOlderToGuardian(olderKey.trim());
      if (res.isSuccess) {
        Alert.alert('성공', '동행자 연결이 완료되었습니다.');
        router.replace('/home');
      } else {
        Alert.alert('실패', res.message || '연결 실패');
      }
    } catch (err) {
      Alert.alert('오류', '연결 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>연결할 동행자 키</Text>
      <TextInput
        style={styles.input}
        value={olderKey}
        onChangeText={setOlderKey}
        placeholder="노인 고유 키 입력"
      />
      <TouchableOpacity onPress={handleLink} style={styles.submitButton}>
        <Text style={styles.submitText}>연결하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: COLORS.white },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
