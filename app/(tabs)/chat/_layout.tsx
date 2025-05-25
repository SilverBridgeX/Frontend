// app/(tabs)/chat/_layout.tsx
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  // 내부 화면(Header) 숨기기
      }}
    />
  );
}
