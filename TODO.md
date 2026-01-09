# TODO List - HeroUI Integration với Mosaic Lite

## ✅ Đã hoàn thành

### 1. Setup HeroUI
- [x] Cài đặt `@heroui/react`, `@heroui/styles`, `framer-motion`
- [x] Tạo file `hero.ts` cho Tailwind v4 configuration
- [x] Cập nhật `style.css` để import HeroUI styles
- [x] Thêm `HeroUIProvider` vào `main.jsx`

### 2. Types & Data Structure
- [x] Tạo `ServerRow` type mở rộng từ `Server` (thêm cpu, ram, disk, network, updatedAt, region)
- [x] Tạo helper functions: `getStatusColor()`, `formatStatus()`

### 3. Servers Table Component
- [x] Tạo `ServersTable.tsx` với HeroUI Table
- [x] Custom cells:
  - [x] Name + IP (2 dòng)
  - [x] Status chip với màu theo trạng thái
  - [x] Usage (CPU/RAM)
  - [x] Updated time (relative)
  - [x] Actions dropdown (View, Restart, Delete)
- [x] Row click navigation đến `/servers/:id`
- [x] Loading state với Skeleton
- [x] Empty state với message

### 4. Servers List Page
- [x] Tạo `ServersListPage.tsx`
- [x] Load data từ `inventoryRepo` và `monitoringRepo`
- [x] Map `Server` → `ServerRow` với metrics
- [x] Integrate với `ServersTable`

### 5. Server Detail Page
- [x] Header với Breadcrumb (Servers / {server.name})
- [x] Status chip + last updated time
- [x] Action buttons (Refresh, Restart, Edit)
- [x] KPI Cards (CPU, RAM, Disk, Network) với CircularProgress
- [x] Tabs component:
  - [x] Overview tab với ServerOverview component
  - [x] Metrics tab (placeholder)
  - [x] Alerts tab với AlertsTable
  - [x] Activity tab (placeholder)

### 6. Supporting Components
- [x] `ServerKpiCards.tsx` - 4 cards với CircularProgress
- [x] `ServerOverview.tsx` - Key-value pairs cho server info
- [x] `AlertsTable.tsx` - Table hiển thị alerts với severity chips

### 7. Routing
- [x] Cập nhật `app/routes.tsx` để sử dụng `ServersListPage`
- [x] Route `/servers` và `/` đều trỏ đến `ServersListPage`
- [x] Route `/servers/:id` trỏ đến `ServerDetailPage`

## ✅ Đã khôi phục Layout Mosaic

### 8. Layout Restoration
- [x] Khôi phục AppLayout với Sidebar và Header từ Mosaic
- [x] Cập nhật Sidebar navigation để link đến Servers, Ports, Alerts
- [x] Đảm bảo layout structure giống Dashboard.jsx (flex h-screen, sidebar + content area)
- [x] Build thành công, không có lỗi

## 🔄 Đang làm / Cần làm

### 9. Code Organization
- [ ] Di chuyển `ServerDetailPage` vào `pages/servers/` (tùy chọn)
- [ ] Review và cleanup unused imports

### 10. Styling & Theme Consistency
- [ ] Đồng bộ màu sắc giữa Mosaic và HeroUI
- [ ] Đảm bảo spacing scale nhất quán
- [ ] Test dark mode (nếu có)
- [ ] Kiểm tra responsive design
- [ ] Test styling conflicts giữa Mosaic và HeroUI

### 11. Features cần implement
- [ ] Restart server action (hiện tại chỉ console.log)
- [ ] Edit server action (hiện tại chỉ console.log)
- [ ] Delete server action với confirmation
- [ ] Metrics charts trong Metrics tab (sử dụng Chart.js hiện có)
- [ ] Activity timeline trong Activity tab
- [ ] Search/filter trong ServersTable
- [ ] Sorting trong ServersTable (nếu cần)
- [ ] Pagination (client-side hoặc server-side)

### 12. Data Integration
- [ ] Thay thế mock metrics (cpu, ram, disk) bằng API data
- [ ] Connect với PocketBase khi API sẵn sàng
- [ ] Error handling và retry logic
- [ ] Loading states cho từng section

### 13. Testing & Polish
- [ ] Test tất cả navigation flows
- [ ] Test với empty data
- [ ] Test với error states
- [ ] Performance optimization (nếu cần)
- [ ] Accessibility check

## 📝 Notes

### Về Mock Data
- Mock data hiện tại đang được sử dụng trong `inventoryRepo.ts` và `monitoringRepo.ts`
- Có flag `useMock = true` để switch giữa mock và API
- **Khuyến nghị**: Giữ lại mock data để:
  - Development/testing khi API chưa sẵn sàng
  - Fallback khi API lỗi
  - Demo/staging environment
- Khi API sẵn sàng, chỉ cần set `useMock = false` và implement API calls

### Cấu trúc code hiện tại
```
src/
  components/
    servers/
      ServersTable.tsx
      ServerKpiCards.tsx
      ServerOverview.tsx
      AlertsTable.tsx
  pages/
    servers/
      ServersListPage.tsx
    ServerDetail/
      index.tsx (có thể di chuyển vào servers/)
  types/
    servers.ts (mới)
```

### Next Steps
1. Test ứng dụng và fix các bugs nếu có
2. Implement các actions (Restart, Edit, Delete)
3. Thêm charts vào Metrics tab
4. Khi API sẵn sàng, update data layer
