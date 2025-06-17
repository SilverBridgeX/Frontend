import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

export default function AddressSearchScreen() {
  const router = useRouter();
  const { callback } = useLocalSearchParams();

  const handleSelect = (data: any) => {
    const roadAddress = data.roadAddress;
    console.log('✅ 선택된 주소:', roadAddress);
    console.log('📦 콜백 대상 screen:', callback);

     router.push({
      pathname: `/${callback}`,
      params: { address: roadAddress },
    } as any);
  };

  return (
    <>
      <Stack.Screen options={{ title: '주소 검색' }} />
      <View style={{ flex: 1 }}>
        <Postcode
          style={{ width: '100%', height: '100%' }}
          jsOptions={{ animation: true }}
          onSelected={handleSelect}
          onError={(err) => {
            console.error('❌ 다음 주소 검색 오류:', err);
          }}
        />
      </View>
    </>
  );
}
