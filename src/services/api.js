/**
 * API Service for Course Management (QuanLyKhoaHoc_MockAPI)
 * Kết nối MockAPI.io REST API với đầy đủ các phương thức CRUD
 */

// ============================================================================
// CẤU HÌNH BASE_URL CỦA MOCKAPI
// Thay thế YOUR_PROJECT_ID bằng ID dự án MockAPI thực tế của bạn
// Ví dụ: "https://6789abcd.mockapi.io/api/v1"
// ============================================================================
export const BASE_URL = "https://6789abcd.mockapi.io/api/v1";

// Dữ liệu mẫu ban đầu theo chuẩn yêu cầu đề bài (tối thiểu 3 danh mục và 10 khóa học)
const INITIAL_CATEGORIES = [
  {
    id: "1",
    name: "Lập trình Mobile",
    description: "Android, Flutter, React Native",
  },
  {
    id: "2",
    name: "Lập trình Web",
    description: "Frontend (React, Vue) và Backend (NodeJS, Java)",
  },
  {
    id: "3",
    name: "Trí tuệ nhân tạo",
    description: "AI, Machine Learning, Deep Learning, NLP",
  },
];

const INITIAL_COURSES = [
  {
    id: "1",
    title: "Lập trình React Native toàn diện",
    description: "Xây dựng ứng dụng di động đa nền tảng iOS & Android với Expo, React Navigation và Redux.",
    categoryId: "1",
    instructor: "Nguyễn Văn A",
    price: 650000,
    duration: 36,
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    createdAt: "2026-10-10",
  },
  {
    id: "2",
    title: "Lập trình Android với Kotlin & Jetpack Compose",
    description: "Làm chủ kiến trúc MVVM, Room Database, Coroutines và giao diện hiện đại Declarative UI.",
    categoryId: "1",
    instructor: "Trần Thị B",
    price: 590000,
    duration: 40,
    thumbnail: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    createdAt: "2026-10-11",
  },
  {
    id: "3",
    title: "Lập trình Flutter từ cơ bản đến nâng cao",
    description: "Phát triển ứng dụng mượt mà với Dart, Bloc Pattern và kết nối Firebase Cloud Firestore.",
    categoryId: "1",
    instructor: "Lê Văn C",
    price: 550000,
    duration: 32,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: "2026-10-12",
  },
  {
    id: "4",
    title: "Frontend Master: React.js & TypeScript",
    description: "Học tư duy Component, Hooks nâng cao, Next.js App Router và tối ưu SEO cho web hiện đại.",
    categoryId: "2",
    instructor: "Phạm Minh D",
    price: 720000,
    duration: 45,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    createdAt: "2026-10-09",
  },
  {
    id: "5",
    title: "Xây dựng RESTful API với Node.js & Express",
    description: "Thiết kế backend chuẩn REST, bảo mật JWT, xác thực OAuth2 và kết nối CSDL MongoDB / PostgreSQL.",
    categoryId: "2",
    instructor: "Hoàng Gia E",
    price: 490000,
    duration: 28,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    createdAt: "2026-10-08",
  },
  {
    id: "6",
    title: "Fullstack Web với Spring Boot & Vue 3",
    description: "Phát triển hệ thống quy mô doanh nghiệp với Java Spring Boot, Hibernate và giao diện Vue 3.",
    categoryId: "2",
    instructor: "Đỗ Quốc F",
    price: 850000,
    duration: 50,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    createdAt: "2026-10-07",
  },
  {
    id: "7",
    title: "Nhập môn Trí tuệ nhân tạo & Machine Learning",
    description: "Nắm vững toán học cho AI, xử lý dữ liệu với Python Pandas/Numpy và các thuật toán hồi quy, phân loại.",
    categoryId: "3",
    instructor: "TS. Vũ Hải G",
    price: 900000,
    duration: 48,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    createdAt: "2026-10-06",
  },
  {
    id: "8",
    title: "Deep Learning & Thị giác máy tính (Computer Vision)",
    description: "Nhận diện khuôn mặt, phát hiện vật thể thời gian thực bằng PyTorch, OpenCV và mạng CNN.",
    categoryId: "3",
    instructor: "Đặng Quang H",
    price: 950000,
    duration: 42,
    thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    createdAt: "2026-10-05",
  },
  {
    id: "9",
    title: "Xử lý ngôn ngữ tự nhiên (NLP) & Large Language Models",
    description: "Khám phá kiến trúc Transformer, xây dựng chatbot thông minh và tinh chỉnh các mô hình LLM.",
    categoryId: "3",
    instructor: "Bùi Tuấn K",
    price: 1200000,
    duration: 38,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    createdAt: "2026-10-04",
  },
  {
    id: "10",
    title: "Lập trình iOS Native với Swift & SwiftUI",
    description: "Thiết kế ứng dụng chuẩn phong cách Apple, xử lý animation mượt mà và tích hợp CoreData / Combine.",
    categoryId: "1",
    instructor: "Nguyễn Đức Duy",
    price: 680000,
    duration: 35,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    createdAt: "2026-10-03",
  },
];

// Bộ nhớ đệm Local fallback (hoạt động khi MockAPI chưa tạo hoặc mạng offline)
let localCategories = [...INITIAL_CATEGORIES];
let localCourses = [...INITIAL_COURSES];

// Helper xử lý HTTP request an toàn
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[MockAPI Request Notice] ${options.method || "GET"} ${url} failed:`, error.message);
    throw error;
  }
}

// ============================================================================
// API CATEGORIES (DANH MỤC KHÓA HỌC)
// ============================================================================

export const getCategories = async () => {
  try {
    const data = await apiRequest("/categories");
    if (Array.isArray(data) && data.length > 0) {
      localCategories = data;
      return data;
    }
    return localCategories;
  } catch (err) {
    return localCategories;
  }
};

export const getCategoryById = async (id) => {
  try {
    return await apiRequest(`/categories/${id}`);
  } catch (err) {
    return localCategories.find((c) => String(c.id) === String(id)) || null;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const created = await apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    localCategories.push(created);
    return created;
  } catch (err) {
    const newCategory = {
      id: String(Date.now()),
      ...categoryData,
    };
    localCategories.push(newCategory);
    return newCategory;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const updated = await apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    const idx = localCategories.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) localCategories[idx] = updated;
    return updated;
  } catch (err) {
    const idx = localCategories.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], ...categoryData };
      return localCategories[idx];
    }
    return null;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await apiRequest(`/categories/${id}`, {
      method: "DELETE",
    });
    localCategories = localCategories.filter((c) => String(c.id) !== String(id));
    return res;
  } catch (err) {
    localCategories = localCategories.filter((c) => String(c.id) !== String(id));
    return { success: true };
  }
};

// ============================================================================
// API COURSES (KHÓA HỌC)
// ============================================================================

export const getCourses = async () => {
  try {
    const data = await apiRequest("/courses");
    if (Array.isArray(data) && data.length > 0) {
      localCourses = data;
      return data;
    }
    return localCourses;
  } catch (err) {
    return localCourses;
  }
};

export const getCourseById = async (id) => {
  try {
    return await apiRequest(`/courses/${id}`);
  } catch (err) {
    return localCourses.find((c) => String(c.id) === String(id)) || null;
  }
};

export const createCourse = async (courseData) => {
  try {
    const created = await apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
    localCourses.unshift(created);
    return created;
  } catch (err) {
    const newCourse = {
      id: String(Date.now()),
      ...courseData,
      createdAt: courseData.createdAt || new Date().toISOString().split("T")[0],
    };
    localCourses.unshift(newCourse);
    return newCourse;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const updated = await apiRequest(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
    const idx = localCourses.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) localCourses[idx] = updated;
    return updated;
  } catch (err) {
    const idx = localCourses.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      localCourses[idx] = { ...localCourses[idx], ...courseData };
      return localCourses[idx];
    }
    return null;
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await apiRequest(`/courses/${id}`, {
      method: "DELETE",
    });
    localCourses = localCourses.filter((c) => String(c.id) !== String(id));
    return res;
  } catch (err) {
    localCourses = localCourses.filter((c) => String(c.id) !== String(id));
    return { success: true };
  }
};
