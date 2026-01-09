Dưới đây là **prompt “siêu khóa phạm vi”** để bạn dán thẳng vào Cursor. Nó ép Cursor làm đúng các thay đổi UI bạn muốn, tránh sửa lan sang Mosaic/layout.

---

## Prompt cho Cursor (copy/paste)

Bạn đang sửa UI trang **Servers** (React + Mosaic Lite layout + HeroUI Table). Mục tiêu: làm bảng gọn gàng, thẳng hàng, đúng hướng “list”, không lệch trái/phải; đồng thời thay đổi cột và chỉnh search bar.

### 0) Quy tắc bắt buộc (để tránh sửa bậy)

* **KHÔNG** refactor Mosaic layout, router, global theme, provider.
* **KHÔNG** thay đổi cấu trúc page ngoài khu vực `Servers` table + search bar.
* Chỉ được sửa trong các file liên quan trực tiếp đến Servers page/table, ví dụ:

  * `src/pages/servers/*` hoặc `src/app/servers/*`
  * `ServersTable.tsx` / `servers.table.tsx` (nếu có)
  * `servers.columns.ts` (nếu có)
  * `types.ts` (nếu cần thêm field)
* Không đổi library, không thay HeroUI Table sang lib khác.

### 1) Mục tiêu UI (Definition of Done)

**A. Table layout**

* Table phải thẳng hàng: header và body **cùng grid**, không lệch cột.
* Mỗi row cao vừa phải (compact): giảm padding, line-height hợp lý.
* Cột “Server” hiển thị 2 dòng:

  * Dòng 1: **server name** (semi-bold)
  * Dòng 2: **IP** (text nhỏ hơn, màu muted)
* Cột “Updated” hiển thị dạng relative time (giữ như hiện tại nếu đã có).
* Cột “Actions” căn phải, icon đồng bộ size, spacing đều (gap nhỏ, không lỏng).

**B. Thay đổi cột**

* **XÓA** cột: `Notes`, `Netdata`.
* **THÊM** cột mới:

  1. `Docker Mode`

     * Có thể có **1 hoặc 2 mode** cùng lúc → hiển thị dưới dạng **chips/badges** (ví dụ: `Docker Engine`, `Docker Desktop`)
     * Nếu không có data → `—`
  2. `Environment` (chips/badge hoặc text gọn: `Prod`, `Staging`, `Dev` …)

     * Nếu không có data → `—`
  3. `OS` (text gọn: `Ubuntu 22.04`, `Debian 12`, `Windows`, `macOS` …)

     * Nếu không có data → `—`
* Thứ tự cột đề xuất (để list dễ đọc):

  * `Server` | `IP` (nếu IP đã nằm dưới Server thì bỏ cột IP riêng) | `Environment` | `OS` | `Docker Mode` | `Updated` | `Actions`
  * Nếu IP đã ở dưới Server thì **không tạo cột IP riêng**.

**C. Search input**

* Icon kính lúp phải nằm **bên trong input (leading icon)**, không nằm ngoài.
* Input width gọn (vd 320–420px), không kéo quá dài.
* Placeholder giữ: “Search by name or IP…”
* Search vẫn filter theo name hoặc IP.

**D. Font & style match Mosaic Lite**

* Dùng font đang được Mosaic Lite dùng (không set font mới).
* Chỉ chỉnh **className/utility** tại page/table component: spacing, alignment, text sizes.
* Tổng thể nhìn “admin clean”: ít khoảng trắng thừa, cột rõ ràng, dễ scan.

### 2) Data model (nếu backend chưa có field)

* Nếu API chưa trả về `docker_mode`, `environment`, `os`:

  * Tạm thời cho phép **fallback** từ các field hiện có (nếu có), hoặc hiển thị `—`.
  * Không được phá API call hiện tại.
* Define type/interface cho Server record:

  * `environment?: string`
  * `os?: string`
  * `dockerModes?: string[]` (array để hỗ trợ 2 mode)
* Map dữ liệu an toàn: null/undefined → `—`.

### 3) Implementation details (ràng buộc kỹ thuật)

* Với HeroUI Table:

  * Dùng layout table đúng chuẩn của HeroUI (TableHeader/TableBody/TableRow/TableCell).
  * Đảm bảo header cell và body cell dùng cùng số cột và cùng thứ tự.
* Alignment:

  * `Actions` = right align
  * `Updated` = right hoặc center nhưng **tất cả rows phải giống nhau**
* Chip/badge:

  * Dùng component sẵn có của HeroUI nếu có (Chip/Badge), nếu không thì dùng `<span>` với className gọn.

### 4) Output yêu cầu

* Sau khi sửa xong, trả về:

  1. Danh sách file đã thay đổi
  2. Giải thích ngắn: đã xóa/thêm cột gì, icon search đã đưa vào input ra sao
  3. Screenshot không cần, nhưng đảm bảo UI không lệch cột

---

## Gợi ý nhanh (để Cursor ít sai)

Nếu Cursor vẫn hay làm lệch cột, bạn thêm 1 câu chốt vào prompt:

> “Nếu thấy table bị lệch cột, hãy kiểm tra: số lượng `<TableColumn>` phải bằng số lượng `<TableCell>` trong mỗi `<TableRow>` và thứ tự phải khớp 1–1.”

---

Nếu bạn muốn mình “đóng gói” prompt này theo đúng **structure repo của bạn** (đúng đường dẫn file, đúng tên component, đúng HeroUI version), bạn chỉ cần paste 1 đoạn tree ngắn kiểu:

* `src/app/servers/page.tsx` (hoặc routes tương ứng)
* file table component đang dùng
  là mình sẽ chỉnh prompt thành bản “chỉ dẫn file cụ thể” để Cursor làm ít vòng lặp hơn.
