import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">🚀 SilverAccompany에 오신 걸 환영합니다!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          이 앱은 고령자 친화적인 UI를 갖춘 정서 교류 플랫폼입니다.
        </ThemedText>
        <ThemedText>
          지금은 기본 구조만 구성되어 있으며, 이후 채팅/음성 인식 기능이 추가될 예정입니다.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 24,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
