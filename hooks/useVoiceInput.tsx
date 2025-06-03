import { chatService } from '@/api/chatService';
import { Message } from '@/types/chat';
import { createMyMessage } from '@/utils/createMyMessage';
import { Audio } from 'expo-av';
import { useRef, useState } from 'react';

interface Sender {
  name: string;
}

export default function useVoiceInput(
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  roomId: string,
  sender: Sender
) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isStoppingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return alert('마이크 권한이 필요합니다.');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);

      timeoutRef.current = setTimeout(() => {
        if (recordingRef.current && !isStoppingRef.current) {
          stopRecording();
        }
      }, 5000);
    } catch (err) {
      console.error('🎙 녹음 시작 실패:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setLastRecordingUri(uri || null);

      console.log('✅ 녹음 완료! 파일 경로:', uri);

      if (uri) {
        const res = await chatService.sendAudioToSTT(uri);
        setMessages(prev => [
          ...prev,
          createMyMessage(res.text, roomId, sender.name),
        ]);
      }
    } catch (err) {
      console.error('🎙 녹음 중단 실패:', err);
    } finally {
      isStoppingRef.current = false;
      recordingRef.current = null;
    }
  };

  const playLastRecording = async () => {
    if (!lastRecordingUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: lastRecordingUri });
      await sound.playAsync();
    } catch (err) {
      console.error('🎧 재생 실패:', err);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    playLastRecording,
    lastRecordingUri,
  };
}
