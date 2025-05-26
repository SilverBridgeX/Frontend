// components/chat/useVoiceInput.ts
import api from '@/lib/api';
import { Message } from '@/types/message';
import { Audio } from 'expo-av';
import { useRef, useState } from 'react';

export default function useVoiceInput(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return alert('마이크 권한이 필요합니다.');

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);

      // 자동 중단
      setTimeout(() => {
        if (recordingRef.current) stopRecording();
      }, 5000);
    } catch (err) {
      console.error('녹음 시작 실패:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);

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
    } catch (err) {
      console.error('음성 인식 실패:', err);
      setIsRecording(false);
    }
  };

  return { isRecording, startRecording, stopRecording };
}
