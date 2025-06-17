import { cancelSubscription, cancelSubscriptionWithKey, getPaymentStatus, getPaymentStatusWithKey, requestPaymentReady, requestPaymentReadyWithKey } from '@/api/userService';
import { ROLE } from '@/constants/user';
import { useChatStore } from '@/store/chatStore';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Linking,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function PaymentScreen() {
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [validDate, setValidDate] = useState<boolean | null>(null);
  const [nextDate, setNextDate] = useState<string | null>(null);
  const [paymentURL, setPaymentURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole, key } = useChatStore();

  const fetchStatus = async () => {
    try {
      let data;
      if (userRole === ROLE.OLDER) {
        data = await getPaymentStatus();
      } else {
        data = await getPaymentStatusWithKey({ id: key });
      }
      const status = data?.result?.status;
      const approvedAt = data?.result?.last_approved_at;

      const next = dayjs(approvedAt).add(30, 'day').format('YYYY년 M월 D일');
      setNextDate(next);

      if (approvedAt != null) {
        setValidDate(dayjs(approvedAt).add(30, 'day') > dayjs());
      }

      if (status === 'ACTIVE') {
        setIsPaid(true);
      } else if (status === 'INACTIVE') {
        setIsPaid(false);
      } else {
        setIsPaid(null);
      }
    } catch (error) {
      Alert.alert('오류', '결제 정보를 불러오지 못했습니다.');
      console.error(error);
      setIsPaid(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayment = async () => {
    try {
      let data;
      if (userRole === ROLE.OLDER) {
        data = await requestPaymentReady();
        console.log("older")
      } else {
        data = await requestPaymentReadyWithKey({ id: key });
        console.log("guardian")
      }
      setPaymentURL(data?.result?.next_redirect_mobile_url);
    } catch (error) {
      Alert.alert('오류', '결제 URL을 불러오지 못했습니다.');
      console.error(error);
    }
  };

  const handleCancel = async () => {
    try {
      if (userRole === ROLE.OLDER) {
        await cancelSubscription();
      } else {
        await cancelSubscriptionWithKey({ id: key });
      }
      Alert.alert('알림', '구독이 취소되었습니다.');
      fetchStatus(); // 다시 상태 갱신
    } catch (error) {
      Alert.alert('오류', '구독 취소에 실패했습니다.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayment();
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>은빛동행 결제</Text>
      {isPaid === true && validDate === true && (
        <>
          <Text style={styles.subHeader}>다음 결제 예정일은 <Text style={{ fontWeight: 'bold' }}>{nextDate}</Text> 입니다.</Text>
          <Text style={styles.sectionTitle}>회원님이 누리고 있는 혜택</Text>
          <View style={styles.benefitBox}>
            <View style={styles.benefitItem}>
              <Image source={require('@/assets/images/chat.png')} style={styles.icon} />
              <Text style={styles.benefitText}>채팅방 개수 무제한</Text>
            </View>
            <View style={styles.benefitItem}>
              <Image source={require('@/assets/images/group.png')} style={styles.icon} />
              <Text style={styles.benefitText}>맞춤 사회 활동 추천</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={styles.buttonText}>해지하기</Text>
          </TouchableOpacity>
        </>
      )}

      {isPaid === false && validDate === true && (
        <>
          <Text style={styles.subHeader}>혜택이 <Text style={{ fontWeight: 'bold' }}>{nextDate}</Text>에 종료됩니다.</Text>
          <Text style={styles.sectionTitle}>회원님이 누리고 있는 혜택</Text>
          <View style={styles.benefitBox}>
            <View style={styles.benefitItem}>
              <Image source={require('@/assets/images/chat.png')} style={styles.icon} />
              <Text style={styles.benefitText}>채팅방 개수 무제한</Text>
            </View>
            <View style={styles.benefitItem}>
              <Image source={require('@/assets/images/group.png')} style={styles.icon} />
              <Text style={styles.benefitText}>맞춤 사회 활동 추천</Text>
            </View>
          </View>
        </>
      )}

      {((isPaid === null && validDate === null) || (isPaid === false && validDate === false)) && (
        <>
          <Text style={styles.subHeader}>당신의 이야기를 들어줄 친구, 지금 만나보세요.</Text>
          <Text style={styles.description}>은빛동행이 따뜻한 인연을 연결해드립니다.</Text>

          <View style={styles.featureBox}>
            <Image source={require('@/assets/images/chat.png')} style={styles.icon} />
            <View>
              <Text style={styles.featureTitle}>채팅방 개수 제한 해제</Text>
              <Text style={styles.featureDescription}>채팅방을 무제한으로 이용할 수 있어요.</Text>
            </View>
          </View>

          <View style={styles.featureBox}>
            <Image source={require('@/assets/images/group.png')} style={styles.icon} />
            <View>
              <Text style={styles.featureTitle}>맞춤 사회 활동 추천 기능</Text>
              <Text style={styles.featureDescription}>친구와 함께 무엇을 하면 좋을지 추천 받아요.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {
            if (paymentURL) {
              Linking.openURL(paymentURL);
            } else {
              Alert.alert('오류', '결제 URL이 없습니다.');
            }
          }}>
            <Text style={styles.buttonText}>9,900원 결제하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: { fontSize: 36, fontWeight: 'bold', color: '#FFA500', marginBottom: 10 },
  subHeader: { fontSize: 18, color: '#888', marginBottom: 40, textAlign: 'center' },
  description: { fontSize: 18, color: '#888', marginBottom: 60, textAlign: 'center' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000' },
  benefitBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    marginBottom: 60,
  },
  benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  icon: { width: 40, height: 40, marginRight: 10 },
  benefitText: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  featureBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, width: '100%' },
  featureTitle: { fontSize: 24, fontWeight: 'bold' },
  featureDescription: { fontSize: 16, color: '#666' },
  button: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
});
