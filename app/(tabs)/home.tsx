import { ROLE } from '@/constants/user';
import HomeGuardianScreen from '@/screen/HomeGuardianScreen';
import HomeScreen from '@/screen/HomeScreen';
import { useChatStore } from '@/store/chatStore';
import React from 'react';

export default function Home() {
  const { userRole } = useChatStore();

  if (userRole === ROLE.OLDER_PROTECTER) {
    return <HomeGuardianScreen />;
  }

  return <HomeScreen />;
}
