import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getCategories, createCourse, updateCourse } from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';

export default function CourseFormScreen({ route, navigation }) {
  const { courseId, courseData } = route.params || {};
  const isEditing = Boolean(courseId);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState(courseData?.title || '');
  const [description, setDescription] = useState(courseData?.description || '');
  const [categoryId, setCategoryId] = useState(courseData?.categoryId || '');
  const [instructor, setInstructor] = useState(courseData?.instructor || '');
  const [price, setPrice] = useState(
    courseData?.price !== undefined ? String(courseData.price) : ''
  );
  const [duration, setDuration] = useState(
    courseData?.duration !== undefined ? String(courseData.duration) : ''
  );
  const [thumbnail, setThumbnail] = useState(courseData?.thumbnail || '');
  const [trailerUrl, setTrailerUrl] = useState(courseData?.trailerUrl || '');

  // Lỗi form
  const [imageLoadError, setImageLoadError] = useState(false);

  // Tải danh mục cho Dropdown Picker
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data || []);
        const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
        if (data && data.length > 0) {
          const matched = data.find(
            (c) => String(c.id) === String(categoryId) || normalizeId(c.id) === normalizeId(categoryId)
          );
          if (matched) {
            setCategoryId(String(matched.id));
          } else if (!categoryId) {
            setCategoryId(String(data[0].id));
          }
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể tải danh sách danh mục.');
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Xử lý gửi Form
  const handleSubmit = async () => {
    // 1. Kiểm tra không bỏ trống
    if (!title.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tên khóa học.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập mô tả khóa học.');
      return;
    }
    if (!instructor.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập tên giảng viên.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập học phí.');
      return;
    }
    if (!duration.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập thời lượng khóa học.');
      return;
    }
    if (!thumbnail.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập URL ảnh thumbnail.');
      return;
    }

    // 2. Validate học phí không được âm
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      Alert.alert('Lỗi nhập liệu', 'Học phí phải là một số hợp lệ và không được âm (>= 0).');
      return;
    }

    // 3. Validate thời lượng
    const numDuration = Number(duration);
    if (isNaN(numDuration) || numDuration <= 0) {
      Alert.alert('Lỗi nhập liệu', 'Thời lượng phải là một số lớn hơn 0 (giờ).');
      return;
    }

    // 4. Validate categoryId phải tồn tại
    const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
    if (
      !categoryId ||
      !categories.some(
        (c) =>
          String(c.id) === String(categoryId) ||
          normalizeId(c.id) === normalizeId(categoryId)
      )
    ) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng chọn một danh mục hợp lệ.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      categoryId: String(categoryId),
      instructor: instructor.trim(),
      price: numPrice,
      duration: numDuration,
      thumbnail: thumbnail.trim(),
      trailerUrl: trailerUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await updateCourse(courseId, payload);
        Alert.alert('Thành công', 'Cập nhật khóa học thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('CourseList') },
        ]);
      } else {
        await createCourse(payload);
        Alert.alert('Thành công', 'Thêm khóa học mới thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('CourseList') },
        ]);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu khóa học. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <LoadingIndicator message="Đang tải dữ liệu danh mục..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.formTitle}>
              {isEditing ? '✏ Cập nhật Khóa học' : '＋ Thêm Khóa học Mới'}
            </Text>
            <Text style={styles.formSubtitle}>
              Điền đầy đủ thông tin khóa học để đồng bộ với MockAPI
            </Text>
          </View>

          {/* Ô xem trước ảnh thumbnail trực tiếp (Live Image Preview) */}
          <View style={styles.previewCard}>
            <Text style={styles.fieldLabel}>Xem trước ảnh bìa (Live Preview)</Text>
            <View style={styles.previewBox}>
              {thumbnail.trim() && !imageLoadError ? (
                <Image
                  source={{ uri: thumbnail.trim() }}
                  style={styles.previewImage}
                  resizeMode="cover"
                  onError={() => setImageLoadError(true)}
                  onLoadStart={() => setImageLoadError(false)}
                />
              ) : (
                <View style={styles.previewPlaceholder}>
                  <Text style={styles.placeholderIcon}>🖼</Text>
                  <Text style={styles.placeholderText}>
                    {imageLoadError
                      ? '⚠️ Không thể tải ảnh từ URL này'
                      : 'Nhập URL bên dưới để xem trước ảnh'}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Tên khóa học */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tên khóa học <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Lập trình React Native toàn diện"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Dropdown chọn Danh mục từ API categories */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Danh mục khóa học <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={String(categoryId)}
                onValueChange={(itemValue) => setCategoryId(String(itemValue))}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.name}
                    value={String(cat.id)}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Giảng viên */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Tên giảng viên <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Nguyễn Văn A"
              placeholderTextColor="#94A3B8"
              value={instructor}
              onChangeText={setInstructor}
            />
          </View>

          {/* Học phí & Thời lượng (2 cột) */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>
                Học phí (VNĐ) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="500000"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>
                Thời lượng (giờ) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="30"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>

          {/* URL Thumbnail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              URL ảnh bìa (Thumbnail) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#94A3B8"
              value={thumbnail}
              onChangeText={(text) => {
                setThumbnail(text);
                setImageLoadError(false);
              }}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* URL Video Trailer MP4 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL Video Trailer (MP4)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/trailer.mp4"
              placeholderTextColor="#94A3B8"
              value={trailerUrl}
              onChangeText={setTrailerUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* Mô tả khóa học */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Mô tả chi tiết <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập nội dung, lộ trình chi tiết về khóa học..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Nút Submit Lưu Khóa học */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Lưu thay đổi' : 'Thêm khóa học'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  previewBox: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    padding: 16,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  placeholderText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 90,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
