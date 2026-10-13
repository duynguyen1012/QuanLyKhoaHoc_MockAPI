import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getCourseById, getCategories, deleteCourse } from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params || {};
  const [course, setCourse] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      const [courseData, categoriesData] = await Promise.all([
        getCourseById(courseId),
        getCategories(),
      ]);

      if (courseData) {
        setCourse(courseData);
        const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
        const cat = (categoriesData || []).find(
          (c) =>
            String(c.id) === String(courseData.categoryId) ||
            normalizeId(c.id) === normalizeId(courseData.categoryId)
        );
        setCategoryName(cat ? cat.name : 'Chung');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải thông tin khóa học.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Xác nhận trước khi xóa khóa học
  const handleConfirmDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa khóa học "${course?.title}" không? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteCourse(course.id);
              Alert.alert('Thành công', 'Đã xóa khóa học thành công!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa khóa học. Vui lòng thử lại!');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatPrice = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '0 đ';
    return num.toLocaleString('vi-VN') + ' đ';
  };

  if (loading || deleting) {
    return (
      <LoadingIndicator
        message={deleting ? 'Đang xóa khóa học...' : 'Đang tải chi tiết khóa học...'}
      />
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin khóa học!</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Khu vực phát Video Trailer MP4 qua expo-av */}
        <View style={styles.mediaContainer}>
          {course.trailerUrl ? (
            <Video
              source={{ uri: course.trailerUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          ) : (
            <Image
              source={{
                uri:
                  course.thumbnail ||
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
              }}
              style={styles.fallbackImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.videoBadge}>
            <Text style={styles.videoBadgeText}>▶ Video Trailer</Text>
          </View>
        </View>

        {/* Nội dung thông tin chi tiết */}
        <View style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
            {course.createdAt ? (
              <Text style={styles.dateText}>📅 {course.createdAt}</Text>
            ) : null}
          </View>

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Giảng viên</Text>
              <Text style={styles.metaValue}>👨‍🏫 {course.instructor || 'Chưa cập nhật'}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Thời lượng</Text>
              <Text style={styles.metaValue}>⏱ {course.duration || 0} giờ</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Học phí trọn gói:</Text>
            <Text style={styles.priceValue}>{formatPrice(course.price)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Mô tả khóa học */}
          <Text style={styles.sectionHeading}>Mô tả khóa học</Text>
          <Text style={styles.description}>
            {course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}
          </Text>

          {/* Ảnh bìa thu nhỏ nếu có */}
          {course.thumbnail ? (
            <View style={styles.thumbnailSection}>
              <Text style={styles.sectionHeading}>Ảnh bìa (Thumbnail)</Text>
              <Image
                source={{ uri: course.thumbnail }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Thanh nút bấm hành động ở góc dưới (Sửa & Xóa) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.8}
          onPress={handleConfirmDelete}
        >
          <Text style={styles.deleteBtnText}>🗑 Xóa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CourseForm', {
              courseId: course.id,
              courseData: course,
            })
          }
        >
          <Text style={styles.editBtnText}>✏ Sửa khóa học</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  mediaContainer: {
    width: '100%',
    height: 230,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  videoBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  categoryText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    color: '#DC2626',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  thumbnailSection: {
    marginTop: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },
  editBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
