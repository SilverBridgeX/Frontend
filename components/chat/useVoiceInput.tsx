// components/chat/useVoiceInput.ts
import api from '@/lib/api';
import { Message } from '@/types/message';
import { Audio } from 'expo-av';
import { useRef } from 'react';

export default function useVoiceInput(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startVoiceInput = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return alert('마이크 권한이 필요합니다.');

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;

      setTimeout(async () => {
        if (!recordingRef.current) return;
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        const formData = new FormData();
        formData.append('file', {
          uri,
          type: 'audio/x-wav',
          name: 'voice.wav',
        } as any);

        const res = await api.post('/stt', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), text: res.data.text, fromMe: true },
        ]);
      }, 5000);
    } catch (err) {
      console.error('음성 인식 실패:', err);
    }
  };

  return { startVoiceInput };
}
