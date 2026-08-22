# HƯỚNG DẪN TRIỂN KHAI TRÊN GITHUB PAGES

Tệp cấu hình tự động hóa quy trình triển khai bằng **GitHub Actions** đã được tạo tại thư mục `.github/workflows/deploy.yml`. Mỗi khi bạn thực hiện lệnh `git push` mã nguồn lên nhánh chính (`main` hoặc `master`), GitHub sẽ tự động biên dịch và cập nhật trang web của bạn lên nhánh `gh-pages` để chạy trực tuyến.

Dưới đây là các bước cụ thể để thiết lập trên GitHub của bạn:

---

## 🚀 Bước 1: Cấu hình Quyền hạn trên Repository của bạn
Để GitHub Actions có quyền tạo nhánh `gh-pages` và ghi dữ liệu, bạn cần bật quyền ghi:
1. Truy cập vào kho lưu trữ (Repository) của bạn trên GitHub.
2. Chọn **Settings** (Cài đặt) -> Chọn mục **Actions** -> Chọn **General**.
3. Cuộn xuống phần **Workflow permissions** (Quyền của quy trình công việc).
4. Chọn **Read and write permissions** (Quyền đọc và ghi).
5. Bấm **Save** (Lưu).

---

## 🌐 Bước 2: Cài đặt nguồn trang GitHub Pages
1. Vẫn ở mục **Settings** của Repository -> Chọn **Pages** ở thanh menu bên trái.
2. Tại mục **Build and deployment** -> Phần **Source**, hãy chọn **Deploy from a branch**.
3. Tại phần **Branch**, chọn nhánh là `gh-pages` và thư mục là `/ (root)`.
4. Bấm **Save** (Lưu).

---

## 🔗 Bước 3: Lưu ý đặc biệt về Đường dẫn (Base Path) & Tên miền riêng

### Trường hợp A: Nếu bạn dùng Tên miền riêng (Ví dụ: `https://vscs.asia`)
Nếu bạn cấu hình tên miền riêng `vscs.asia` trỏ về GitHub Pages:
* Đường dẫn gốc trong tệp `vite.config.ts` sẽ là `/` (đây là giá trị mặc định, bạn **giữ nguyên không cần sửa đổi**).
* Để gán tên miền riêng: Tại mục **Settings** -> **Pages** của GitHub, điền tên miền `vscs.asia` của bạn vào ô **Custom domain** và bấm **Save**.

### Trường hợp B: Nếu bạn dùng tên miền mặc định của GitHub dạng phụ mục (Ví dụ: `https://username.github.io/vsc/`)
Nếu bạn đẩy dự án này lên một kho lưu trữ con có tên là `vsc` trên GitHub mà không dùng tên miền riêng, bạn cần cấu hình thêm đường dẫn gốc trong `vite.config.ts`:
1. Mở tệp `vite.config.ts`.
2. Thêm thuộc tính `base: '/vsc/',` vào cấu hình:
   ```typescript
   export default defineConfig(() => {
     return {
       base: '/vsc/', // Tên repository của bạn trên GitHub đặt trong dấu gạch chéo
       plugins: [react(), tailwindcss()],
       // ... các cấu hình khác giữ nguyên
     };
   });
   ```

---

## 🔐 Bước 4: Thiết lập Bảo mật (Firebase API Keys) nếu cần
Hiện tại các khóa cấu hình Firebase trong tệp `/src/lib/firebase.ts` đã được tích hợp trực tiếp, giúp ứng dụng chạy ngay lập tức. Nếu bạn muốn ẩn các khóa này trên mã nguồn GitHub công khai:
1. Bạn có thể sử dụng biến môi trường dạng `import.meta.env.VITE_FIREBASE_API_KEY`.
2. Vào **Settings** -> **Secrets and variables** -> **Actions** trên GitHub để thêm khóa bí mật (Secrets) và tệp Workflow `.github/workflows/deploy.yml` sẽ tự động tải chúng khi biên dịch.
