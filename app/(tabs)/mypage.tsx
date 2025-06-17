import { requestMyPageData } from '@/api/userService';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MenuItem = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color={COLORS.orange} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);


export default function MyPageScreen() {
  const navigation: any = useNavigation();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [address, setAddress] = useState('');

  const fetchMyPageData = async () => {
    try {
      const data = await requestMyPageData();
      setName(data?.result?.nickname);
      setKey(data?.result?.key);
      setAddress(data?.result?.address);
    } catch (error) {
      Alert.alert('오류', '마이페이지 데이터를 불러오지 못했습니다.');
      console.error(error);
    }
  }
  useEffect(() => {
    fetchMyPageData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* 앱바 */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>마이페이지</Text>
      </View>

      {/* 사용자 정보 카드 */}
      <View style={styles.profileCard}>
        <Image source={{ uri: 'https://i.pravatar.cc/100?u=1' }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.key}>{key}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="person-outline"
          label="마이페이지 수정"
          onPress={() =>
            router.push({
              pathname: '/my-detail',
              params: {
                name: name ?? '',
                address: address ?? '',
              },
            })
          }
        />
        <MenuItem icon="card-outline" label="프리미엄 결제" onPress={() => router.push('/payment')} />
        <MenuItem icon="log-out-outline" label="로그아웃" onPress={() => router.push('/login')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  appBar: {
    height: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: SPACING.lg,
    marginBottom: 4,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  key: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  address: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  menuLabel: {
    fontSize: FONT_SIZES.body,
    marginLeft: SPACING.md,
    color: COLORS.black,
  },
});
