import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';
import { useEffect, useState } from 'react';

export default function TabHomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [address, setAddress] = useState<string | null>(null); // ✅ 이 줄 추가

  useEffect(() => {
    if (params.address) {
      setAddress(params.address as string);
    }
  }, [params.address]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="주소 검색하기"
        onPress={() => {
          router.push(
            {
              pathname: '/address',
              params: { callback: 'login/join' },
            } as any
          );
        }}
      />
      {address && <Text style={{ marginTop: 20 }}>선택된 주소: {address}</Text>}
    </View>
  );
}
