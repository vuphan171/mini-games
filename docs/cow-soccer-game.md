# TECHNICAL SPEC — GAME "SIÊU BÒ ÚC SÚT BÓNG"
**Phiên bản:** 2.0 (cập nhật)
**Mục đích tài liệu:** Đây là spec kỹ thuật đầy đủ để implement game. Dev có thể copy nguyên văn tài liệu này vào Claude để bắt đầu code (frontend/backend).

---

## 1. TỔNG QUAN

- **Nền tảng:** Web app, chạy trên trình duyệt tablet (Chrome/Safari)
- **Yêu cầu mạng:** Bắt buộc có internet — dùng để ghi dữ liệu real-time lên Google Sheet. Nếu mất mạng, hiển thị thông báo lỗi **"Mất kết nối mạng"**.
- **Không cần đăng nhập/tài khoản người dùng.**
- **Không cần cài đặt** — truy cập trực tiếp qua URL trên trình duyệt.

---

## 2. LUỒNG MÀN HÌNH (SCREEN FLOW)

```
[Màn hình nhập thông tin khách hàng] (mặc định khi mở app)
        ↓ (bấm "Bắt đầu chơi")
[Màn hình Hướng dẫn luật chơi] (30s, có thể Skip)  ← MỚI
        ↓ (hết 30s tự chuyển, hoặc bấm Skip)
[Màn hình Gameplay]
        ↓ (kết thúc lượt — 2 trường hợp: hết giờ không đụng chướng ngại vật / đụng chướng ngại vật)
[Animation kết thúc lượt] (chỉ có khi THẮNG — đá bóng vào khung thành)
        ↓
[Màn hình kết quả] (Thắng/Thua + hiển thị điểm số) — tự động quay lại sau 5s, hoặc bấm "Lượt tiếp theo"
        ↓
[Màn hình nhập thông tin khách hàng] (quay lại từ đầu)
```

Ngoài ra có **[Màn hình Setting]** (dành cho admin/nhân viên, không nằm trong luồng khách hàng — cần xác định cách truy cập).

---

## 3. MÀN HÌNH 1 — NHẬP THÔNG TIN KHÁCH HÀNG

### 3.1 Trường dữ liệu (theo đúng thứ tự hiển thị)
1. **Tên khách hàng** — text input, bắt buộc
2. **Email** — text input, bắt buộc, validate format email chuẩn
3. **Số điện thoại** — text input, bắt buộc, validate format số điện thoại VN
4. **Cửa hàng** — dropdown, bắt buộc
   - Danh sách hard-code sẵn trong code (chưa có danh sách cụ thể — **CẦN BỔ SUNG danh sách tên cửa hàng thật trước khi code**)
   - **Giá trị mặc định (default value): option cuối cùng trong danh sách**
   - **⚠️ Giá trị đang chọn (`selectedStore`) phải lưu ở global state/context** — vì Data Grid trong Setting (mục 7.5) phụ thuộc trực tiếp vào giá trị này (xem BR-07)

### 3.2 Validate
- Validate **real-time** (onBlur hoặc onChange debounce)
- Sai định dạng Email/SĐT → hiển thị dòng chữ lỗi ngay dưới ô input (VD: `"Email không hợp lệ"`)

### 3.3 Nút "Bắt đầu chơi"
- Label: **"Bắt đầu chơi"**
- **Trạng thái mặc định: disabled**
- **Chỉ enable khi TẤT CẢ điều kiện sau đúng:**
  - Tên khách hàng: không rỗng
  - Email: không rỗng VÀ đúng định dạng
  - Số điện thoại: không rỗng VÀ đúng định dạng
  - Cửa hàng: đã có giá trị được chọn (default = option cuối)

### 3.4 Pseudo-code validate
```js
function isFormValid(form) {
  return (
    form.name.trim().length > 0 &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone) &&
    form.store !== null
  );
}
```

---

## 4. MÀN HÌNH 2 — HƯỚNG DẪN LUẬT CHƠI (TUTORIAL) — MỚI

| Thuộc tính | Giá trị |
|---|---|
| Tần suất hiện | **Mỗi lượt chơi mới đều hiện** (không chỉ lần đầu) |
| Thời lượng | **30 giây** |
| Hết 30s (không thao tác) | **Tự động chuyển sang màn hình Gameplay** |
| Nút Skip | Có nút **"Bỏ qua"/"Skip"** — bấm để chuyển ngay, không cần chờ hết 30s |
| Nội dung | - Luật chơi bằng tiếng Việt (cách điều khiển bò, ăn ngũ cốc/cỏ để cộng điểm, né vắc-xin/virus/trọng tài)<br>- **Bảng mốc điểm ↔ quà tặng (text cứng, hard-code)** — chỉ mang tính hiển thị tham khảo cho khách |

**⚠️ Lưu ý quan trọng:** Bảng mốc điểm/quà tặng **KHÔNG có logic xử lý ở backend** — hệ thống không tính toán hay lưu thông tin quà tặng. PG đứng tại cửa hàng tự đối chiếu điểm số hiển thị ở màn hình kết quả (mục 6) với bảng quà để phát quà thủ công.

---

## 5. MÀN HÌNH 3 — GAMEPLAY

### 5.1 Điều khiển bò
- **Input:** Chạm/kéo (touch/drag) trực tiếp trên màn hình
- **Hướng di chuyển:** CHỈ 2 HƯỚNG NGANG (trái/phải) — bò **cố định 1 hàng ngang duy nhất, KHÔNG đổi vị trí dọc, KHÔNG di chuyển chéo**
- **Khi thả tay:** Bò **dừng khựng ngay lập tức** (không easing/momentum)
- **Giới hạn:** Bò không được đi ra ngoài biên trái/phải sân chơi (clamp vị trí X trong [minX, maxX])

### 5.2 Vật phẩm cộng điểm
Hai loại, **mỗi loại điểm cộng riêng** (config, mục 7.1):
- **Ngũ cốc** → cộng `pointsPerGrain`
- **Cỏ** → cộng `pointsPerGrass`

**Cơ chế xuất hiện:**
- Random vị trí khi bắt đầu lượt chơi mới
- **Không giới hạn số lượng** — ăn hết random sinh thêm liên tục (tốc độ spawn theo config tốc độ game, mục 7.4)
- Cùng quỹ đạo ngang với bò

### 5.3 Chướng ngại vật
Ba loại, **xử lý giống nhau** khi va chạm:
- **Vắc-xin**, **Virus**, **Trọng tài**

**Cơ chế xuất hiện:**
- Random vị trí khi bắt đầu lượt chơi mới, **đứng yên, không di chuyển**

**Khi va chạm (bất kỳ loại nào):**
- Kết thúc lượt ngay lập tức, kết quả = **THUA**
- **KHÔNG có animation** đá bóng, chuyển thẳng sang màn hình kết quả (mục 6)
- Không có âm thanh va chạm riêng — chỉ phát âm thanh thua cuộc lúc hiện màn hình kết quả

### 5.4 Điều kiện kết thúc lượt (Win/Lose condition) — ⚠️ ĐÃ THAY ĐỔI

Xác định bởi config `unlimitedTime` (mục 7.3), **mặc định = OFF**:

**CHẾ ĐỘ MẶC ĐỊNH — `unlimitedTime = OFF` (Có giới hạn thời gian):**

| Điều kiện | Kết quả | Animation |
|---|---|---|
| Chơi hết `timeLimit` giây **mà KHÔNG đụng chướng ngại vật** | **THẮNG** (bất kể điểm số bao nhiêu, điểm chỉ dùng để xác định quà tặng — xem mục 4) | Đá bóng **vào** khung thành |
| Đụng chướng ngại vật (bất kỳ lúc nào trong lượt) | **THUA** | Không có |

> Ở chế độ này, **điểm số KHÔNG quyết định thắng/thua**. Config `winningScore` KHÔNG áp dụng và KHÔNG hiển thị trong Setting.

**CHẾ ĐỘ `unlimitedTime = ON` (Không giới hạn thời gian):**

| Điều kiện | Kết quả | Animation |
|---|---|---|
| `currentScore >= winningScore` (kiểm tra liên tục mỗi lần ăn vật phẩm) | **THẮNG ngay lập tức khi đạt** | Đá bóng **vào** khung thành |
| Đụng chướng ngại vật (bất kỳ lúc nào) | **THUA** | Không có |

> Ở chế độ này, config `winningScore` **hiện ra trong Setting** để Admin nhập (xem mục 7.2).

**❌ ĐÃ LOẠI BỎ:** Animation "đá bóng ra ngoài khung thành" — không còn tồn tại case thua-do-hết-giờ nữa (hết giờ luôn = thắng nếu không đụng chướng ngại vật).

### 5.5 Animation kết thúc lượt (chỉ còn 1 trường hợp)
- **Chỉ trigger khi THẮNG** (cả 2 chế độ)
- Animation: bò đá bóng **vào** khung thành
- Sau khi animation chạy xong → chuyển sang màn hình kết quả (mục 6)
- Khi THUA (đụng chướng ngại vật) → không có animation, vào thẳng màn hình kết quả

### 5.6 Âm thanh trong gameplay

| Âm thanh | Trigger | Loop? |
|---|---|---|
| Nhạc nền (background music) | Phát liên tục từ khi bắt đầu lượt đến khi kết thúc | Có, loop nếu ngắn hơn thời gian chơi |
| Tiếng bò chạy ("huỵch huỵch") | Phát khi đang chạm/kéo di chuyển bò | Loop khi giữ; dừng ngay khi thả tay |
| Âm thanh chiến thắng | Phát SAU KHI animation đá bóng vào kết thúc, lúc hiện màn hình kết quả | Không |
| Âm thanh thua cuộc | Phát ngay lúc hiện màn hình kết quả (không có animation trước đó) | Không |

**Audio ducking:** Khi âm thanh chiến thắng/thua phát, nhạc nền tự động giảm âm lượng, trở lại bình thường sau khi âm thanh đó kết thúc.

---

## 6. MÀN HÌNH 4 — KẾT QUẢ (Thắng/Thua)

- Hiển thị kết quả: **"Thắng"** hoặc **"Thua"** kèm âm thanh tương ứng (mục 5.6)
- **Nếu Thắng: hiển thị rõ số điểm đạt được** trên màn hình — để PG tại cửa hàng đối chiếu bảng quà tặng (mục 4) và phát quà thủ công. Hệ thống không xử lý/lưu thông tin quà tặng.
- **Đếm ngược 5 giây**, hết giờ tự động chuyển về Màn hình 1
- **Nút "Lượt tiếp theo"**: bấm để chuyển ngay lập tức, bỏ qua đếm ngược

---

## 7. MÀN HÌNH SETTING (CONFIG — dành cho Admin)

### 7.1 Config điểm cộng vật phẩm

| Field | Type | Default | Validate |
|---|---|---|---|
| `pointsPerGrain` (điểm ngũ cốc) | Number input | *(cần xác định)* | Không giới hạn min/max |
| `pointsPerGrass` (điểm cỏ) | Number input | *(cần xác định)* | Không giới hạn min/max |

### 7.2 Config số điểm để chiến thắng — ⚠️ CHỈ HIỆN CÓ ĐIỀU KIỆN

| Field | Type | Hiển thị khi | Validate |
|---|---|---|---|
| `winningScore` | Number input | **CHỈ hiện khi `unlimitedTime = ON`** | Bắt buộc: `winningScore > pointsPerGrain + pointsPerGrass`, vi phạm → báo lỗi, chặn lưu |

### 7.3 Config thời gian mỗi lượt

| Field | Type | Default | Behavior |
|---|---|---|---|
| `unlimitedTime` | Toggle switch | **OFF (Tắt)** | **OFF = Có giới hạn thời gian** (mặc định) → hiện `timeLimit`, ẩn `winningScore`<br>**ON = Không giới hạn** → ẩn `timeLimit`, hiện `winningScore` |
| `timeLimit` | Number input (giây) | — | Chỉ hiện khi `unlimitedTime = OFF`. Bắt buộc nhập nếu hiển thị. |

**Pseudo-code UI logic:**
```js
// unlimitedTime mặc định = false (OFF = có giới hạn thời gian)
<Toggle
  checked={unlimitedTime}
  onChange={setUnlimitedTime}
  label="Không giới hạn thời gian chơi"
  defaultValue={false}
/>

{!unlimitedTime && (
  <NumberInput
    label="Thời gian mỗi lượt (giây)"
    value={timeLimit}
    onChange={setTimeLimit}
    required
  />
)}

{unlimitedTime && (
  <NumberInput
    label="Số điểm để chiến thắng"
    value={winningScore}
    onChange={setWinningScore}
    validate={(v) => v > pointsPerGrain + pointsPerGrass}
    required
  />
)}
```

### 7.4 Config tốc độ game

| Field | Type | Options | Default |
|---|---|---|---|
| `gameSpeed` | Dropdown | `Slow`, `Normal`, `Fast`, `Very Fast` | `Normal` |

Áp dụng cho: tốc độ di chuyển bò, tần suất chướng ngại vật, tốc độ respawn vật phẩm cộng điểm.

### 7.5 Data Grid xem trước dữ liệu — ⚠️ ĐÃ THAY ĐỔI (đồng bộ theo dropdown)

| Thuộc tính | Giá trị |
|---|---|
| Nguồn xác định cửa hàng | **Đồng bộ theo giá trị `selectedStore`** (dropdown "Cửa hàng" đang chọn ở Màn hình 1, mục 3.1) — KHÔNG gán cứng theo tablet |
| Khi đổi dropdown Cửa hàng ở Màn hình 1 | Data Grid **tự động cập nhật lại ngay**, load đúng dữ liệu (sheet) của cửa hàng vừa chọn |
| Filter | Date picker (mặc định = hôm nay) hoặc "All" |
| Cột hiển thị đầy đủ | Tên khách hàng, Email, SĐT, Điểm số, Thắng/Thua, Thời gian chơi, Ngày giờ chơi |
| Chế độ | View-only — KHÔNG sửa/xóa được |

**Business Rule:**
- **BR-07:** `selectedStore` là **shared state/global state**, dùng chung cho cả Màn hình 1 (nhập thông tin khách) và Data Grid trong Setting. Thay đổi ở 1 nơi phải phản ánh ngay ở nơi còn lại (reactive/subscribe theo state, không lấy giá trị 1 lần rồi cache tĩnh).

---

## 8. DATA MODEL & LƯU TRỮ

### 8.1 Cấu trúc bản ghi (1 dòng dữ liệu)
Được tạo **CHỈ KHI kết thúc lượt chơi** (không tạo khi bắt đầu chơi):

| Cột | Kiểu dữ liệu | Ví dụ | Ghi chú |
|---|---|---|---|
| Tên khách hàng | String | Nguyễn Văn A | |
| Email | String | a@email.com | |
| Số điện thoại | String | 0901234567 | |
| Cửa hàng | String | (theo dropdown đã chọn) | |
| Điểm số | Number | 120 | Điểm đạt được khi kết thúc lượt |
| Thắng/Thua | String | `"Thắng"` hoặc `"Thua"` | Theo logic mục 5.4 |
| Thời gian chơi | Number (giây) | 45 | Thời lượng thực tế đã chơi |
| Ngày giờ chơi | String | `30/07/2026 14:23:05` | Format: `dd/mm/yyyy hh:mm:ss` |

### 8.2 Nơi lưu trữ: Google Sheet
- **1 file Google Sheet duy nhất**, dùng chung cho toàn bộ hệ thống
- **Tách nhiều sheet (tab) theo từng cửa hàng** — tên sheet = tên cửa hàng trong dropdown (mục 3.1)
- Ghi dữ liệu: mỗi bản ghi = append 1 hàng mới vào đúng sheet của cửa hàng đó (dựa theo `selectedStore` tại thời điểm kết thúc lượt)
- **Ghi real-time** ngay sau khi lượt chơi kết thúc

### 8.3 Xử lý lỗi mạng
- Mất kết nối mạng khi đang lưu → hiển thị thông báo lỗi **"Mất kết nối mạng"**
- *(Cơ chế retry/queue: chưa chốt, để BE quyết định khi implement)*

---

## 9. CẦN BỔ SUNG TRƯỚC KHI CODE (Open items)

- [ ] Danh sách tên cửa hàng cụ thể (dropdown + tên sheet)
- [ ] Giá trị mặc định của `pointsPerGrain`, `pointsPerGrass`, `winningScore`, `timeLimit`
- [ ] Cách truy cập màn hình Setting — ẩn ở đâu, có cần mật khẩu/PIN không?
- [ ] Nội dung text luật chơi cụ thể (hiển thị trong 30s Tutorial)
- [ ] Danh sách mốc điểm + tên quà tương ứng (text cứng, do khách hàng/PG cung cấp)
- [ ] Asset hình ảnh: bò, ngũ cốc, cỏ, vắc-xin, virus, trọng tài, khung thành/cầu môn, sân cỏ, hình minh họa quà tặng theo mốc
- [ ] Asset âm thanh: nhạc nền, tiếng bò chạy, âm thanh thắng, âm thanh thua
- [ ] Cơ chế retry/queue khi mất mạng lúc lưu dữ liệu
- [ ] Quyền truy cập file Google Sheet (ai được xem/chỉnh, cách xác thực API)

---

## 10. TÓM TẮT FUNCTION LIST (mapping ID cũ)

| ID | Tên chức năng | Section trong doc này |
|---|---|---|
| A-01, A-02 | Màn hình + validate thông tin khách hàng | Mục 3 |
| — | Màn hình Hướng dẫn luật chơi (Tutorial) | Mục 4 *(mới)* |
| A-03, A-04 | Lưu bản ghi + Google Sheet | Mục 8 |
| A-05 | Màn hình kết quả + quay lại | Mục 6 |
| B-01 | Điều khiển bò | Mục 5.1 |
| B-02 | Vật phẩm cộng điểm | Mục 5.2 |
| B-03 | Chướng ngại vật | Mục 5.3 |
| B-04 | Điều kiện thắng/thua | Mục 5.4 *(đã đổi logic)* |
| B-05, B-06 | Âm thanh thắng/thua | Mục 5.6 |
| B-08 | Animation đá bóng (chỉ còn case thắng) | Mục 5.5 |
| B-09, B-10 | Nhạc nền, tiếng bò chạy | Mục 5.6 |
| C-01, C-01b | Config điểm | Mục 7.1, 7.2 |
| C-02 | Config thời gian (toggle, default OFF) | Mục 7.3 |
| C-03 | Config tốc độ | Mục 7.4 |
| C-04 | Data Grid (đồng bộ theo dropdown) | Mục 7.5 *(đã đổi logic)* |
| C-05 | Nền web, xử lý mất mạng | Mục 1, 8.3 |
