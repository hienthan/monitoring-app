Bạn đang làm đúng hướng: **giữ Mosaic Lite làm “shell/layout”**, rồi **thay phần nội dung (pages/components) bằng HeroUI** theo từng bước. Việc bạn cần làm, theo thứ tự ưu tiên, là như sau.

## 1) Chốt chiến lược tích hợp: Mosaic làm layout, HeroUI làm UI layer

* Giữ nguyên: sidebar, header, routing, auth/mock data (nếu có) của Mosaic.
* Thay dần: bảng Servers, Server details (cards/tabs/metrics), form (nếu có) bằng HeroUI.
* Nguyên tắc: mỗi page “đổi” một lần, không rewrite toàn bộ.

## 2) Cài HeroUI và “wire” vào Tailwind/Mosaic

Trong Mosaic Lite (thường là Vite + Tailwind), bạn cần:

1. Cài package HeroUI
2. Thêm provider (nếu HeroUI yêu cầu)
3. Đảm bảo Tailwind config + CSS import đúng để HeroUI render chuẩn

Ví dụ (tùy version HeroUI bạn dùng, tên package có thể khác; bạn theo docs HeroUI bạn đã cài):

```bash
npm i @heroui/react framer-motion
# hoặc pnpm/yarn tương đương
```

Trong `main.tsx` hoặc `App.tsx`, wrap app bằng provider (nếu docs yêu cầu):

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ví dụ provider (tùy docs HeroUI)
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);
```

Nếu HeroUI yêu cầu plugin tailwind hoặc content paths, thêm vào `tailwind.config.js/ts`:

* `content` phải include cả source của bạn và node_modules của HeroUI (nếu docs nói vậy).
* Nếu Mosaic có theme riêng (CSS variables), bạn cần kiểm tra clash với HeroUI tokens.

## 3) Làm Servers Grid bằng HeroUI Table (custom cells)

Bạn sẽ tạo một component `ServersTable.tsx` và map data → rows. Checklist cần có:

### Data contract (tối thiểu)

```ts
export type ServerRow = {
  id: string;
  name: string;
  ip?: string;
  region?: string;
  status: "online" | "degraded" | "down";
  cpu?: number;   // %
  ram?: number;   // %
  updatedAt?: string;
};
```

### Columns + custom cell render

* Cột `name`: hiển thị name + ip nhỏ bên dưới
* Cột `status`: Chip/Badge màu theo trạng thái
* Cột `usage`: progress mini (cpu/ram)
* Cột `actions`: dropdown (View, Restart, Delete)
* Row click: `navigate(/server/${id})` (ưu tiên cho UX)

Pseudo-structure:

```tsx
// ServersTable.tsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const columns = [
  { key: "name", label: "Server" },
  { key: "status", label: "Status" },
  { key: "region", label: "Region" },
  { key: "usage", label: "Usage" },
  { key: "updatedAt", label: "Updated" },
  { key: "actions", label: "" },
] as const;

export function ServersTable({ rows }: { rows: ServerRow[] }) {
  const nav = useNavigate();

  const renderCell = (row: ServerRow, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{row.name}</div>
            {row.ip && <div className="text-xs opacity-70 truncate">{row.ip}</div>}
          </div>
        );
      case "status":
        return (
          <Chip /* color theo status */>
            {row.status}
          </Chip>
        );
      case "usage":
        return (
          <div className="text-xs">
            CPU {row.cpu ?? "-"}% • RAM {row.ram ?? "-"}%
          </div>
        );
      case "actions":
        return (
          <Button size="sm" variant="light" onPress={() => nav(`/server/${row.id}`)}>
            View
          </Button>
        );
      default:
        return (row as any)[columnKey] ?? "-";
    }
  };

  return (
    <Table
      aria-label="Servers"
      selectionMode="none"
      onRowAction={(key) => nav(`/server/${String(key)}`)} // nếu HeroUI hỗ trợ row actions
    >
      <TableHeader columns={columns as any}>
        {(col: any) => <TableColumn key={col.key}>{col.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => <TableCell>{renderCell(row, String(columnKey))}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
```

### Những việc bạn cần quyết định ngay cho Table

* Pagination: client-side hay server-side?
* Sorting/filter: có cần ngay không (ít nhất: status filter + search name/ip)?
* Loading state: dùng Skeleton rows.
* Empty state: “No servers found”.

## 4) Làm `server/{id}` bằng HeroUI nhưng giữ layout Mosaic

Tạo `ServerDetailPage.tsx` nằm trong “content area” của Mosaic. Blueprint tối thiểu:

1. **Header**

* Breadcrumb: Servers / {server.name}
* Status chip + last updated
* Actions: Refresh, Restart, Edit

2. **Summary Cards (4 cards)**

* CPU, RAM, Disk, Network (Card + metric)

3. **Tabs**

* Overview: key-value (hostname, OS, region, tags…)
* Metrics: chart (tạm mock)
* Alerts: table list
* Activity: timeline/list

HeroUI thường có: `Card`, `Tabs`, `Table`, `Chip`, `Dropdown`, `Button`, `Skeleton`.

## 5) Chuẩn hóa “design language” giữa Mosaic và HeroUI

Đây là phần hay bị “lệch tone” nhất khi mix template + UI lib.

Bạn cần:

* Chọn 1 font, 1 spacing scale (Mosaic đã có Tailwind class).
* Đồng bộ màu nền / card border / text opacity.
* Nếu Mosaic dùng dark/gray background, cấu hình HeroUI theme tương ứng (nếu có).
* Quy định 2–3 variants bạn dùng xuyên suốt: `primary`, `light`, `bordered`… để UI nhất quán.

## 6) Tổ chức code để đổi dần, không vỡ cấu trúc Mosaic

Gợi ý structure:

```
src/
  pages/
    servers/
      ServersListPage.tsx
      ServerDetailPage.tsx
  components/
    servers/
      ServersTable.tsx
      ServerStatusChip.tsx
      ServerKpiCards.tsx
      ServerOverview.tsx
```

## 7) Mock data + sau đó gắn PocketBase

* Giữ interface `ServerRow` và `ServerDetail`.
* Khi chuyển sang PocketBase, bạn chỉ thay layer `services/servers.ts` (fetch/list/getById), còn UI giữ nguyên.

---

### “Việc t cần làm là gì?” (tóm tắt checklist)

1. Integrate HeroUI vào Mosaic (provider + tailwind config + css).
2. Tạo `ServersTable` (HeroUI Table + renderCell custom).
3. Map click row → route `/server/:id`.
4. Tạo `ServerDetailPage` theo blueprint (header + cards + tabs).
5. Đồng bộ style (theme/spacing) để không bị “2 hệ UI”.
6. Tách data layer (mock → PocketBase) để không phải sửa UI lần nữa.

Nếu bạn paste cho tôi:

* link repo Mosaic Lite bạn đang dùng (hoặc tên variant),
* router bạn đang dùng (react-router-dom hay khác),
* và 1 sample data object của server,

tôi sẽ viết luôn 2 file “drop-in”: `ServersTable.tsx` + `ServerDetailPage.tsx` khớp với cấu trúc Mosaic hiện tại của bạn.
