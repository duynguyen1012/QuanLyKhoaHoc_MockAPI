import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  getCategories,
  getCourses,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function CategoryManagerScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State cho Modal Thêm/Sửa danh mục
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [categoriesData, coursesData] = await Promise.all([
        getCategories(),
        getCourses(),
      ]);
      setCategories(categoriesData || []);
      setCourses(coursesData || []);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu danh mục.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Tính số lượng khóa học của từng danh mục
  const courseCountMap = useMemo(() => {
    const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
    const map = {};
    categories.forEach((cat) => {
      const catId = String(cat.id);
      const count = courses.filter(
        (c) => String(c.categoryId) === catId || normalizeId(c.categoryId) === normalizeId(catId)
      ).length;
      map[catId] = count;
    });
    return map;
  }, [courses, categories]);

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalVisible(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setModalVisible(true);
  };

  // Lưu danh mục (POST hoặc PUT)
  const handleSaveCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Tên danh mục không được để trống.');
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
        });
        Alert.alert('Thành công', 'Cập nhật danh mục thành công!');
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        Alert.alert('Thành công', 'Thêm danh mục mới thành công!');
      }
      setModalVisible(false);
      loadData();
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu danh mục. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // LOGIC RÀNG BUỘC CỰC KỲ QUAN TRỌNG:
  // Tuyệt đối không cho phép xóa danh mục nếu đang có khóa học thuộc danh mục đó!
  // ============================================================================
  const handleDeleteCategory = (cat) => {
    const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
    const associatedCourses = courses.filter(
      (c) =>
        String(c.categoryId) === String(cat.id) ||
        normalizeId(c.categoryId) === normalizeId(cat.id)
    );

    if (associatedCourses.length > 0) {
      Alert.alert(
        '⚠️ Không thể xóa danh mục',
        `Danh mục "${cat.name}" hiện đang có ${associatedCourses.length} khóa học thuộc danh mục này (${associatedCourses
          .slice(0, 2)
          .map((c) => `"${c.title}"`)
          .join(', ')}${
          associatedCourses.length > 2 ? '...' : ''
        }).\n\nBạn phải chuyển hoặc xóa các khóa học thuộc danh mục này trước khi xóa danh mục!`,
        [{ text: 'Đã hiểu', style: 'default' }]
      );
      return;
    }

    // Nếu không có khóa học nào thuộc danh mục, hiển thị hộp thoại xác nhận xóa
    Alert.alert(
      'Xác nhận xóa danh mục',
      `Bạn có chắc chắn muốn xóa danh mục "${cat.name}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteCategory(cat.id);
              Alert.alert('Thành công', 'Đã xóa danh mục thành công!');
              loadData();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa danh mục. Vui lòng thử lại!');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return <LoadingIndicator message="Đang tải danh sách danh mục..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header thông tin */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quản Lý Danh Mục</Text>
            <Text style={styles.subtitle}>
              Tổng số: {categories.length} danh mục
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={handleOpenAddModal}
          >
            <Text style={styles.addBtnText}>＋ Thêm danh mục</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách danh mục */}
        {categories.length === 0 ? (
          <EmptyState
            title="Chưa có danh mục nào"
            message="Bấm nút Thêm danh mục để tạo danh mục đầu tiên."
            actionText="Thêm danh mục"
            onAction={handleOpenAddModal}
          />
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2563EB']}
              />
            }
            renderItem={({ item }) => {
              const count = courseCountMap[String(item.id)] || 0;
              return (
                <View style={styles.categoryCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.categoryName}>{item.name}</Text>
                      <View
                        style={[
                          styles.countBadge,
                          count > 0 ? styles.countActive : styles.countZero,
                        ]}
                      >
                        <Text
                          style={[
                            styles.countText,
                            count > 0 ? styles.countTextActive : styles.countTextZero,
                          ]}
                        >
                          {count} khóa học
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.categoryDesc}>
                    {item.description || 'Chưa có mô tả cho danh mục này.'}
                  </Text>

                  {/* Nút Sửa & Xóa */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editActionBtn}
                      onPress={() => handleOpenEditModal(item)}
                    >
                      <Text style={styles.editActionText}>✏ Sửa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteActionBtn}
                      onPress={() => handleDeleteCategory(item)}
                    >
                      <Text style={styles.deleteActionText}>🗑 Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Modal Thêm / Sửa Danh mục */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {editingCategory ? '✏ Chỉnh sửa danh mục' : '＋ Thêm danh mục mới'}
              </Text>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>
                  Tên danh mục <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Ví dụ: Lập trình Mobile"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Mô tả danh mục</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Ví dụ: Android, iOS, React Native, Flutter..."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalSaveBtn, saving && styles.modalSaveDisabled]}
                  onPress={handleSaveCategory}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.modalSaveText}>Lưu danh mục</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  countBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  countActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  countZero: {
    backgroundColor: '#F1F5F9',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
  countTextActive: {
    color: '#1D4ED8',
  },
  countTextZero: {
    color: '#64748B',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 0.5,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  editActionBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 0.5,
    borderColor: '#BFDBFE',
  },
  editActionText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteActionBtn: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  deleteActionText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInputGroup: {
    marginBottom: 14,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  modalTextArea: {
    minHeight: 70,
  },
  modalBtnRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSaveDisabled: {
    backgroundColor: '#93C5FD',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
