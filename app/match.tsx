import { requestMatching } from '@/api/userService';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

function MatchComplete() {
  const user1 = { name: '김순이', avatar: 'https://i.pravatar.cc/100?u=1' };
  const user2 = { name: '박영수', avatar: 'https://i.pravatar.cc/100?u=2' };

  return (
    <View style={styles.content}>
      <View style={styles.matchProfiles}>
        {[user1, user2].map((user, idx) => (
          <View key={idx} style={styles.profile}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.matchTitle}>매칭 완료!</Text>
      <Text style={styles.matchText}>두 분이 성공적으로 매칭되었습니다.</Text>
      <Text style={styles.matchText}>즐거운 만남 되세요!</Text>
    </View>
  );
}


export default function MatchScreen() {
  const navigation = useNavigation();
  const [matched, setMatched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const shouldCallAPI = minutes === 20 || minutes === 40 || minutes === 0;

    if (shouldCallAPI) {
      requestMatching()
        .then((res) => {
          if (res?.isSuccess && res.result) {
            setMatched(true);
          } else {
            setError('매칭에 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        })
        .catch((err) => {
          console.error('매칭 요청 중 에러:', err);
          setError('서버에 문제가 발생했습니다. 관리자에게 문의해주세요.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 짧은 지연 후 메시지 출력
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>만남 매칭</Text>
      </View>

      {isLoading ? (
        <View style={styles.content}>
          <Text style={styles.text}>로딩 중...</Text>
          <ActivityIndicator size="large" color={COLORS.black} style={styles.loader} />
        </View>
      ) : matched ? (
        <MatchComplete />
      ) : error ? (
        <View style={styles.content}>
          <Text style={styles.text}>{error}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.text}>당신의 친구를 찾는 중입니다...</Text>
          <ActivityIndicator size="large" color={COLORS.black} style={styles.loader} />
        </View>
      )}
    </View>
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
    alignItems: 'center',
    paddingTop: 10,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.orange,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  loader: {
    marginTop: SPACING.md,
  },
  matchTitle: {
    fontSize: FONT_SIZES.title + 4,
    fontWeight: 'bold',
    color: COLORS.lemon,
    marginBottom: SPACING.lg,
  },
  matchImage: {
    width: 120,
    height: 120,
    marginBottom: SPACING.lg,
    resizeMode: 'contain',
  },
  matchText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.black,
    marginBottom: 4,
  },
  matchProfiles: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl, // 간격을 더 크게 (기존 lg → xl)
    gap: SPACING.lg, // React Native 0.71+에서 지원, 이전 버전은 marginRight 사용
  },
  profile: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 4,
  },
  name: {
    fontSize: FONT_SIZES.title,
    fontWeight: '500',
    color: COLORS.black,
  },
});
