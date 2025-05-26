import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
// import api from '@/lib/api'; // 🔒 추후 사용 시 주석 해제
// import { Message } from '@/types/message'; // 🔒 추후 사용 시 주석 해제

// export default function useVoiceInput(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
export default function useVoiceInput() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isStoppingRef = useRef(false); // ✅ 중복 stop 방지
  const [isRecording, setIsRecording] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);

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

      // 5초 후 자동 중단 (중복 방지 조건 포함)
      setTimeout(() => {
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
    if (isStoppingRef.current) return; // ✅ 중복 방지
    isStoppingRef.current = true;

    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setLastRecordingUri(uri || null);

      console.log('✅ 녹음 완료! 파일 경로:', uri);

      // ✅ 자동 재생은 주석 처리 중
      /*
      if (uri) {
        const { sound } = await Audio.Sound.createAsync({ uri });
        await sound.playAsync();
      }
      */

      // 🔒 STT 서버 전송 로직 - 추후 백엔드 준비 시 사용
      /*
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
      */

    } catch (err) {
      console.error('🎙 녹음 중단 실패:', err);
    } finally {
      isStoppingRef.current = false;
      recordingRef.current = null; // ✅ 참조 해제
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
