import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCourses, getCategories } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function CourseListScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');

  // Load data on screen focus
  const loadData = useCallback(async () => {
    try {
      const [coursesData, categoriesData] = await Promise.all([
        getCourses(),
        getCategories(),
      ]);
      setCourses(coursesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu khóa học:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Tra cứu tên danh mục theo categoryId (tuyệt đối không hardcode)
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      const idStr = String(cat.id);
      map[idStr] = cat.name;
      map[`categoryId ${idStr}`] = cat.name;
      map[`categoryId_${idStr}`] = cat.name;
    });
    return map;
  }, [categories]);

  // Bộ lọc theo tên/giảng viên và theo danh mục
  const filteredCourses = useMemo(() => {
    const normalizeId = (id) => String(id || '').replace(/^categoryId[\s_]*/i, '').trim();
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.instructor &&
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

      const courseCatId = normalizeId(course.categoryId);
      const filterCatId = normalizeId(selectedCategoryId);

      const matchesCategory =
        selectedCategoryId === 'ALL' ||
        String(course.categoryId) === String(selectedCategoryId) ||
        courseCatId === filterCatId;

      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, selectedCategoryId]);

  if (loading && !refreshing) {
    return <LoadingIndicator message="Đang tải danh sách khóa học..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.appTitle}>Quản Lý Khóa Học</Text>
            <Text style={styles.appSubtitle}>
              {courses.length} khóa học | {categories.length} danh mục
            </Text>
          </View>
          <TouchableOpacity
            style={styles.categoryNavBtn}
            onPress={() => navigation.navigate('CategoryManager')}
          >
            <Text style={styles.categoryNavBtnText}>📂 Danh mục</Text>
          </TouchableOpacity>
        </View>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên khóa học hoặc giảng viên..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Bộ lọc danh mục ngang */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedCategoryId === 'ALL' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedCategoryId('ALL')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCategoryId === 'ALL' && styles.filterPillTextActive,
                ]}
              >
                Tất cả ({courses.length})
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => {
              const count = courses.filter(
                (c) => String(c.categoryId) === String(cat.id)
              ).length;
              const isActive = String(selectedCategoryId) === String(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isActive && styles.filterPillTextActive,
                    ]}
                  >
                    {cat.name} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Danh sách khóa học */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            title="Không tìm thấy khóa học"
            message={
              searchQuery
                ? `Không có kết quả phù hợp với từ khóa "${searchQuery}"`
                : 'Chưa có khóa học nào trong danh mục này.'
            }
            actionText="Thêm khóa học mới"
            onAction={() => navigation.navigate('CourseForm')}
          />
        ) : (
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                categoryName={categoryMap[String(item.categoryId)]}
                onPress={() =>
                  navigation.navigate('CourseDetail', { courseId: item.id })
                }
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2563EB']}
              />
            }
          />
        )}

        {/* Floating Action Button (FAB) để thêm khóa học */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CourseForm')}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  categoryNavBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  categoryNavBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearIcon: {
    fontSize: 14,
    color: '#94A3B8',
    padding: 4,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 85,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 32,
    fontWeight: '600',
  },
});
