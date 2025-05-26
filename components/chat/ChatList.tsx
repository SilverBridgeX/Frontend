// components/chat/ChatList.tsx
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { Message } from '@/types/message';
import React, { forwardRef } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

const DefaultAvatar = require("../../assets/images/img_profile.png");

interface Props {
  messages: Message[];
}

const ChatList = forwardRef<FlatList, Props>(({ messages }, ref) => (
  <FlatList
    ref={ref}
    data={messages}
    keyExtractor={item => item.id}
    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
    renderItem={({ item }) =>
      item.fromMe ? (
        <View style={[styles.bubble, styles.myBubble]}>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      ) : (
        <View>
          <View style={styles.row}>
            <Image source={item.avatar || DefaultAvatar} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View style={[styles.bubble, styles.otherBubble]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </View>
      )
    }
  />
));

export default ChatList;

const styles = StyleSheet.create({
  bubble: {
    marginVertical: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.medium,
  },
  myBubble: {
    backgroundColor: COLORS.lemon,
    alignSelf: 'flex-end',
    maxWidth: '50%',
  },
  otherBubble: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    maxWidth: Dimensions.get('window').width * 0.5,
    ...SHADOWS.bubble,
    marginLeft: 32,
  },
  text: { color: COLORS.black },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  name: { fontSize: FONT_SIZES.small, fontWeight: 'bold', color: COLORS.black },
});
