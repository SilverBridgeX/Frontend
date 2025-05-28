// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
 return <Redirect href="/home" />;
  // 슬래시(/) 없이 상대 경로 권장
}
