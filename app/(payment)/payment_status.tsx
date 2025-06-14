import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentStatusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>은빛동행 결제</Text>
      <Text style={styles.subHeader}>
        다음 결제 예정일은 <Text style={{ fontWeight: 'bold', color: '#888' }}>2025년 6월 15일</Text> 입니다.
      </Text>

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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>해지하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: '#888',
    marginBottom: 50,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  benefitBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    marginBottom: 60,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FFA500',
    paddingVertical: 18,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
