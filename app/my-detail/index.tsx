import { updateNickname, updateAddress } from '@/api/userService';
import { COLORS } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function MyDetailScreen() {
  const { name: nameParam, address: addressParam } = useLocalSearchParams<{
    name?: string;
    address?: string;
  }>();

  const { userName, setUserName } = useChatStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // ✅ 주소 파라미터가 들어오면 자동 입력
  useEffect(() => {
    console.log('🪝 addressParam from route:', addressParam); // 여기가 문제
    if (addressParam) {
      setAddress(addressParam as string);
      setName(userName as string);
    }

  }, [addressParam]);

  useEffect(() => {
    console.log(nameParam);
    if (nameParam) setName(nameParam);
    if (addressParam) setAddress(addressParam);
  }, [])

  

  const handleComplete = async () => {
    try {
      const res1 = await updateNickname({
        nickname: name,
      });

      const res2 = await updateAddress({
        streetAddress: address,
      });

      if (res1.isSuccess && res2.isSuccess) {
        console.log('개인정보 변경 성공!');
        router.replace('/mypage');
        alert('개인 정보를 변경하였습니다!');
      } else {
        alert('개인 정보 변경 실패: ' + res1.message + ' & ' + res2.message);
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
          router.push({
            pathname: '/address',
            params: { callback: 'my-detail' },
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