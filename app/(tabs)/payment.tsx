import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>은빛동행 결제</Text>
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>9,900원 결제하기</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  description: {
    fontSize: 18,
    color: '#888',
    marginBottom: 60,
  },
  featureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
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

export default PaymentScreen;
