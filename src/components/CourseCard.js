import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CourseCard({ course, categoryName, onPress }) {
  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '0 đ';
    return num.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={{
          uri: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{categoryName || 'Chung'}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.instructor} numberOfLines={1}>
          👨‍🏫 {course.instructor || 'Chưa cập nhật'}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(course.price)}</Text>
          {course.duration ? (
            <Text style={styles.duration}>⏱ {course.duration} giờ</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  thumbnail: {
    width: 120,
    height: 125,
    backgroundColor: '#E2E8F0',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  categoryText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
    lineHeight: 20,
  },
  instructor: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#F1F5F9',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  duration: {
    fontSize: 12,
    color: '#64748B',
  },
});
