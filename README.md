# 📱 Ứng Dụng Quản Lý Khóa Học (Course Management - MockAPI)

[![Platform](https://img.shields.io/badge/Platform-React%20Native%20%7C%20Expo-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-black.svg)](https://expo.dev/)
[![Navigation](https://img.shields.io/badge/React%20Navigation-Native%20Stack-6b21a8.svg)](https://reactnavigation.org/)
[![Video](https://img.shields.io/badge/Media-expo--video%20%7C%20expo--av-orange.svg)](https://docs.expo.dev/versions/latest/sdk/video/)
[![Backend](https://img.shields.io/badge/Backend-MockAPI.io%20(REST)-0284c7.svg)](https://mockapi.io/)

> Ứng dụng di động **Quản lý khóa học trực tuyến** xây dựng bằng **React Native (Expo)**, tích hợp kết nối **REST API (MockAPI.io)** với đầy đủ các thao tác **CRUD** cho 2 resource: `categories` (Danh mục) và `courses` (Khóa học), phát trực tiếp video trailer MP4 bằng `expo-av`, bộ lọc tìm kiếm theo danh mục và xử lý ràng buộc toàn vẹn dữ liệu nghiêm ngặt.

---
link video demo: https://drive.google.com/file/d/1F_fKpZ7Wk7bsPxjCKDmEUyQkbIw2AqZG/view?usp=sharing
## 📌 Mục lục
- [Giới thiệu dự án & Mục tiêu](#-giới-thiệu-dự-án--mục-tiêu)
- [Cấu trúc Database (REST API MockAPI.io)](#-cấu-trúc-database-rest-api-mockapiio)
- [Công nghệ & Thư viện sử dụng](#-công-nghệ--thư-viện-sử-dụng)
- [Chi tiết 4 Màn hình & Chức năng cốt lõi](#-chi-tiết-4-màn-hình--chức-năng-cốt-lõi)
- [Hướng dẫn cài đặt & Khởi chạy ứng dụng](#-hướng-dẫn-cài-đặt--khởi-chạy-ứng-dụng)
- [Cấu trúc thư mục mã nguồn](#-cấu-trúc-thư-mục-mã-nguồn)
- [Thông tin sinh viên thực hiện](#-thông-tin-sinh-viên-thực-hiện)

---

## 📖 Giới thiệu dự án & Mục tiêu

Dự án được xây dựng bám sát 100% các tiêu chí yêu cầu trong đề bài:
1. **Quản lý Khóa học:** Thực hiện đầy đủ các chức năng thêm mới, xem chi tiết, chỉnh sửa và xóa khóa học.
2. **Quan hệ dữ liệu 1 - N:** Mỗi khóa học thuộc đúng một danh mục (`courses.categoryId = categories.id`). Tên danh mục được ánh xạ tự động từ API `categories`, **tuyệt đối không hardcode**.
3. **Phát video Trailer:** Tích hợp trình phát video chất lượng cao hỗ trợ định dạng MP4 trực tiếp thông qua thư viện `expo-av`.
4. **Xem trước ảnh tức thì (Live Preview):** Khi người dùng dán/nhập URL ảnh thumbnail vào form, app lập tức hiển thị ảnh xem trước.
5. **Ràng buộc khóa ngoại ở phía App:** Trước khi xóa bất kỳ danh mục nào, hệ thống kiểm tra danh sách khóa học. Nếu danh mục đang có khóa học tồn tại, hệ thống từ chối xóa và hiển thị cảnh báo chi tiết.
6. **Xử lý trạng thái phụ:** Quản lý ActivityIndicator khi tải (Loading state), xử lý lỗi mạng (Try/Catch) và giao diện thân thiện khi danh sách rỗng (Empty State).

---

## 🗄 Cấu trúc Database (REST API MockAPI.io)

### 1. Categories (Danh mục khóa học)
* **Endpoint:** `GET, POST /categories`, `GET, PUT, DELETE /categories/:id`
* **Schema:**
  - `id` (String): Mã danh mục tự sinh.
  - `name` (String): Tên danh mục (Ví dụ: *"Lập trình Mobile"*).
  - `description` (String): Mô tả danh mục.

### 2. Courses (Khóa học)
* **Endpoint:** `GET, POST /courses`, `GET, PUT, DELETE /courses/:id`
* **Schema:**
  - `id` (String): Mã khóa học tự sinh.
  - `title` (String): Tên khóa học.
  - `description` (String): Mô tả khóa học.
  - `categoryId` (String): Mã danh mục liên kết với bảng `Categories`.
  - `instructor` (String): Tên giảng viên phụ trách.
  - `price` (Number): Học phí (VNĐ, không âm).
  - `duration` (Number): Thời lượng học (giờ, > 0).
  - `thumbnail` (String): URL ảnh bìa.
  - `trailerUrl` (String): URL video trailer MP4.
  - `createdAt` (String): Ngày tạo khóa học (YYYY-MM-DD).

> ⚙️ **Cấu hình Base URL:**
> Đã kết nối với MockAPI.io:
> ```javascript
> export const BASE_URL = "https://6ace0684f338359cf1c2e828.mockapi.io/api/v1";
> ```

---

## 🛠 Công nghệ & Thư viện sử dụng

| Phân loại | Tên công nghệ / Thư viện | Mô tả chi tiết |
| :--- | :--- | :--- |
| **Framework** | **React Native (Expo SDK 52)** | Môi trường phát triển ứng dụng di động đa nền tảng hiện đại. |
| **Điều hướng** | **@react-navigation/native-stack** | Quản lý chuyển trang (Stack Navigation) hiệu năng cao. |
| **Phát video** | **expo-av** | Thư viện chính thức của Expo để phát video MP4 kèm bộ điều khiển Native Controls. |
| **Dropdown** | **@react-native-picker/picker** | Thành phần chọn danh mục dạng Dropdown/Spinner chuẩn Mobile. |
| **Giao tiếp mạng**| **Fetch API & Coroutines/Async** | Gọi REST API bất đồng bộ với timeout và cơ chế phòng vệ lỗi. |
| **Quản lý dữ liệu**| **React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)** | Tối ưu hóa render và quản lý state cục bộ mượt mà. |

---

## 📱 Chi tiết 4 Màn hình & Chức năng cốt lõi

### 1. Screen 1: Danh sách khóa học (`CourseListScreen`)
* Gọi API `GET /courses` và `GET /categories` để nạp dữ liệu đồng thời.
* Hiển thị danh sách khóa học dạng thẻ (`CourseCard`) với ảnh bìa, tên, giảng viên, học phí và huy hiệu danh mục động.
* Tích hợp thanh tìm kiếm (Search) theo tên khóa học hoặc giảng viên.
* Bộ lọc (Filter Pills) cuộn ngang theo từng danh mục: *"Tất cả"*, *"Lập trình Mobile"*, *"Lập trình Web"*,...
* Hỗ trợ vuốt xuống để làm mới dữ liệu (`RefreshControl`).
* Nút bấm nổi **FAB (+)** chuyển nhanh tới màn hình thêm khóa học và nút điều hướng tới quản lý danh mục.

### 2. Screen 2: Chi tiết khóa học (`CourseDetailScreen`)
* Nhận `courseId` từ danh sách và gọi API `GET /courses/:id`.
* Tích hợp component `<Video>` từ `expo-av` để phát trực tiếp video trailer MP4 toàn màn hình hoặc inline với `useNativeControls`.
* Hiển thị chi tiết giảng viên, thời lượng, học phí định dạng tiền tệ VNĐ và mô tả khóa học.
* Cung cấp nút **"Sửa"** (chuyển sang Screen 3 với dữ liệu điền sẵn) và nút **"Xóa"** kèm hộp thoại `Alert.alert` xác nhận trước khi gọi API `DELETE /courses/:id`.

### 3. Screen 3: Form Thêm/Sửa khóa học (`CourseFormScreen`)
* Nhập các trường: Tên khóa học, Giảng viên, Học phí, Thời lượng, URL ảnh bìa, URL trailer, Mô tả.
* Ô chọn danh mục sử dụng `@react-native-picker/picker` nạp dữ liệu động từ API `GET /categories`.
* **Live Image Preview:** Hiển thị tức thì khung xem trước ảnh bìa ngay khi người dùng nhập URL ảnh thumbnail.
* **Validate chặt chẽ:** Kiểm tra không bỏ trống trường nào, học phí `>= 0`, thời lượng `> 0`, danh mục phải tồn tại.
* Gửi `POST` (thêm mới) hoặc `PUT` (cập nhật) và tự động chuyển về trang danh sách với dữ liệu được cập nhật.

### 4. Screen 4: Quản lý danh mục (`CategoryManagerScreen`)
* Hiển thị danh sách danh mục kèm số lượng khóa học đang có trong từng danh mục.
* Hỗ trợ Thêm danh mục mới (`POST /categories`) và Chỉnh sửa danh mục (`PUT /categories/:id`) qua Modal giao diện sạch đẹp.
* **Ràng buộc khóa ngoại bắt buộc:** Kiểm tra `courses.filter(c => c.categoryId === category.id)`. Nếu danh mục đang có khóa học, ứng dụng lập tức từ chối và cảnh báo người dùng. Chỉ khi danh mục có 0 khóa học thì mới cho phép xóa (`DELETE /categories/:id`).

---

## 💻 Hướng dẫn cài đặt & Khởi chạy ứng dụng

### Yêu cầu môi trường
* Đã cài đặt **Node.js** (khuyến nghị v20.x trở lên).
* Điện thoại cài sẵn ứng dụng **Expo Go** (Android / iOS) hoặc chạy qua Android Studio Emulator.

### Các bước thực hiện:
1. **Mở terminal tại thư mục dự án:**
   ```bash
   cd D:\QuanLyKhoaHoc_MockAPI
   ```

2. **Cài đặt thư viện phụ thuộc (nếu chưa cài):**
   ```bash
   npm install
   ```

3. **Khởi động dự án Expo:**
   ```bash
   npx expo start
   ```

4. **Trải nghiệm ứng dụng:**
   - **Trên điện thoại:** Mở ứng dụng **Expo Go**, quét mã QR hiển thị trên màn hình terminal.
   - **Trên máy ảo Android:** Nhấn phím `a` trong terminal để mở trực tiếp trên Android Emulator.
   - **Trên trình duyệt web:** Nhấn phím `w`.

---

## 📂 Cấu trúc thư mục mã nguồn

```text
QuanLyKhoaHoc_MockAPI/
├── src/
│   ├── services/
│   │   └── api.js                  # Module giao tiếp REST API MockAPI (CRUD đầy đủ)
│   ├── screens/
│   │   ├── CourseListScreen.js       # Screen 1: Danh sách, tìm kiếm, lọc danh mục
│   │   ├── CourseDetailScreen.js     # Screen 2: Chi tiết khóa học & phát video trailer expo-av
│   │   ├── CourseFormScreen.js       # Screen 3: Form Thêm/Sửa khóa học, Dropdown, Live Preview
│   │   └── CategoryManagerScreen.js  # Screen 4: Quản lý danh mục & ràng buộc khóa ngoại
│   ├── components/
│   │   ├── CourseCard.js             # Thẻ hiển thị khóa học
│   │   ├── LoadingIndicator.js       # Component hiển thị loading
│   │   └── EmptyState.js             # Component hiển thị khi danh sách trống
│   └── navigation/
│       └── AppNavigator.js           # Điều hướng chính React Navigation Native Stack
├── assets/                           # Icon, splash screen của ứng dụng
├── App.js                            # Root component với SafeAreaProvider
├── app.json                          # Cấu hình Expo application
├── package.json                      # Danh sách dependencies và scripts
├── CHAY_UNG_DUNG.bat                 # Phím tắt khởi động server Expo (quét mã QR)
├── CHAY_TREN_WEB.bat                 # Phím tắt mở trực tiếp trên trình duyệt máy tính
└── README.md                         # Tài liệu hướng dẫn dự án
```

---

## 👤 Thông tin sinh viên thực hiện

* **Họ và tên:** Nguyễn Đức Duy
* **Mã số sinh viên (MSSV):** BIT240080
* **Đề tài:** Ứng dụng Quản lý khóa học (React Native Expo & MockAPI.io)
