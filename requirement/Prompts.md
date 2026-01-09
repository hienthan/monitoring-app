Dưới đây là các **prompt dạng “copy/paste vào Cursor”** theo đúng bối cảnh bạn nói: **Mosaic layout + HeroUI table**, internal tool, PocketBase ở `http://gmo021.cansportsvg.com:8090`. Tôi tách thành các task nhỏ để Cursor làm chắc tay, hạn chế “đập đi xây lại”.

Prompt version 1:
---

## Prompt 1 — Dọn Sidebar (tắt/xóa menu không liên quan) + dựng cây menu đúng

**Mục tiêu:** Sidebar chỉ còn những mục phục vụ monitoring/inventory; thêm 2 mục tương lai: Ticket, Backup Status. Đồng thời sửa cấu trúc cây: `Dashboard` là entry chính, trong đó có `Servers`, `Apps`, `Ports`, `Alerts` (và các mục tương lai).

**Prompt cho Cursor**

> Hãy tìm nơi định nghĩa Sidebar/Nav của Mosaic layout (thường là file kiểu `Sidebar.tsx`, `Navigation.tsx`, `routes.ts`, hoặc `nav-config.ts`).
>
> 1. Xóa/ẩn toàn bộ nhóm menu không liên quan (E-Commerce, Community, Finance, Job Board, Tasks, Messages, Inbox, Calendar, Campaigns, Authentication, Onboarding, Components, Utility…).
> 2. Giữ lại duy nhất nhóm `PAGES` với cấu trúc cây như sau:
>
> * **Dashboard** (route: `/dashboard`)
>
>   * Servers (route: `/dashboard/servers`)
>   * Apps (route: `/dashboard/apps`)
>   * Ports (route: `/dashboard/ports`)
>   * Alerts (route: `/dashboard/alerts`)
> * **Ticket** (route: `/ticket`) [placeholder page: “Coming soon”]
> * **Backup Status** (route: `/backup-status`) [placeholder page: “Coming soon”]
>
> 3. Đảm bảo menu item active/highlight đúng theo route hiện tại, và `Dashboard` có thể expand/collapse.
> 4. Nếu Mosaic dùng icons, chọn icons đơn giản và nhất quán; nếu không có thì bỏ icons cũng được.
> 5. Xác nhận sau khi sửa: sidebar chỉ còn đúng các mục trên và không còn các dropdown thừa.

---

## Prompt 2 — Chuẩn hoá routing: Homepage vào Dashboard, và Servers/Apps/Ports không “cùng cấp”

**Mục tiêu:** `/` redirect về `/dashboard/servers` (hoặc `/dashboard` tuỳ bạn), và Servers/Apps/Ports nằm dưới Dashboard.

**Prompt cho Cursor**

> Hãy kiểm tra routing hiện tại (React Router hay Next.js).
>
> * Nếu là React Router: cập nhật route tree để `/dashboard` là layout route (nested routes).
> * Khi user vào `/` thì redirect về `/dashboard/servers`.
>   Tạo cấu trúc route nested:
> * `/dashboard` (layout: Mosaic main layout)
>
>   * `/dashboard/servers` (server grid)
>   * `/dashboard/servers/:id` (server details)
>   * `/dashboard/apps` (placeholder hoặc list apps)
>   * `/dashboard/ports` (placeholder hoặc list ports)
>   * `/dashboard/alerts` (placeholder)
>     Đảm bảo breadcrumb hiển thị đúng: `Servers > web-01` khi vào details.

---

## Prompt 3 — Bắt buộc dùng PocketBase host:port `http://gmo021.cansportsvg.com:8090`

**Mục tiêu:** toàn bộ API call đi qua đúng base URL, dễ đổi về sau (env var).

**Prompt cho Cursor**

> Hãy chuẩn hoá PocketBase client để luôn dùng baseUrl = `http://gmo021.cansportsvg.com:8090`.
> Yêu cầu:
>
> 1. Tạo 1 file duy nhất để init pb client (ví dụ `src/lib/pb.ts`).
> 2. Base URL đọc từ env var trước (ví dụ `VITE_PB_URL`), nếu không có thì fallback đúng URL trên.
> 3. Refactor tất cả chỗ đang gọi API rải rác sang dùng client này.
> 4. Đảm bảo không hardcode URL ở nhiều nơi nữa (chỉ 1 chỗ).
> 5. Thêm README ngắn (2–3 dòng) nói env var là gì và default value.

---

## Prompt 4 — Refactor Server Details page: chia vùng rõ ràng (Apps + Ports) để hết “hỗn loạn”

Nhìn ảnh thứ 2: spacing đang rất trống và các phần chưa “đóng khung”, khiến rối. Với internal tool, layout hợp lý nhất là **3 tầng**:

1. **Header**: tên server + trạng thái + actions (Refresh/Edit).
2. **Summary strip**: 4 thẻ nhỏ CPU/RAM/Disk/Network (nếu chưa có metrics thì để placeholder).
3. **Body 2 cột**:

   * **Left (1/3):** Server Information card + Required Services card
   * **Right (2/3):** Tabs: `Apps` và `Ports`

     * Apps tab: HeroUI table list apps
     * Port mapping: hiển thị ports của từng app (expand row hoặc panel chi tiết)

**Prompt cho Cursor**

> Hãy refactor UI của trang `/dashboard/servers/:id` để gọn và rõ ràng, theo layout:
>
> * Top: `ServerHeader` gồm breadcrumb, server name, status badge, “Last updated”, actions (Refresh, Edit).
> * Dưới header: 1 hàng 4 `StatCard` (CPU/RAM/Disk/Network). Nếu chưa có netdata metrics thì hiển thị “—” và label “Not loaded”.
> * Main body chia 2 cột (responsive):
>
>   * Cột trái:
>
>     1. Card “Server Information” (hostname, ip, env nếu có, tags nếu có, netdata_url).
>     2. Card “Required Services” (từ collection `server_required_services` nếu đã có; nếu chưa có thì placeholder “No data”).
>   * Cột phải: Tabs gồm `Apps` và `Ports`.
>
>     * Apps tab: HeroUI Table hiển thị apps đang chạy (từ `server_apps` expand `app`), columns: App Name, Owner, Runtime, Notes.
>       *Tối ưu UX:* click 1 row mở “details panel” ngay dưới row (expand) để hiển thị danh sách ports thuộc app đó (dựa vào `server_ports.app_link`).
>     * Ports tab: HeroUI Table liệt kê toàn bộ ports của server, columns: Port, App (resolve từ app_link), Notes.
>       Yêu cầu kỹ thuật:
>
> 1. Data fetch dùng `Promise.all` cho: server, server_apps (expand app), server_ports (expand app_link, app_link.app), services.
> 2. Tạo một view-model map ports theo app_link để render nhanh (groupBy).
> 3. Có loading skeleton cho từng vùng (header/body tables) để đỡ “nhảy layout”.
> 4. Dùng spacing/padding nhất quán theo Mosaic (tránh khoảng trắng quá lớn như ảnh hiện tại).
> 5. Không dùng các tab “Metrics/Activity” nếu chưa implement; chỉ để `Overview(Apps/Ports/Services)` trước đã.
> 6. Đảm bảo responsive: mobile thì cột trái xuống dưới, tabs vẫn dùng được.

---

## Prompt 5 — Chuẩn hoá “Server Grid” theo đúng data thật từ PocketBase

Ảnh thứ 1 đang có các cột kiểu demo (Region/Usage). Nếu chưa có data đó thì nên đổi thành những cột phản ánh schema hiện tại để tránh “fake data”.

**Prompt cho Cursor**

> Hãy cập nhật trang `/dashboard/servers` (server grid) để:
>
> 1. Dùng HeroUI table + custom cell như hiện tại nhưng thay columns thành:
>
>    * Server (name + ip dưới dòng)
>    * Netdata (enabled/disabled badge)
>    * Notes (truncate)
>    * Updated (relative time)
> 2. Row click điều hướng `/dashboard/servers/:id`.
> 3. Thêm search box filter theo name/ip (client-side).
> 4. Bỏ hoàn toàn các cột demo Region/Usage nếu không có data thật.
> 5. Nếu muốn status “Online/Degraded”: tạm thời suy ra từ việc gọi thử `netdata_url` (optional), còn không thì hiển thị “Unknown”.

---

## Những thứ bạn nên bổ sung cho Cursor (để làm nhanh và đúng)

Bạn không bắt buộc trả lời ngay, nhưng đây là các “đầu vào” giúp Cursor không đoán mò:

1. **Bạn đang dùng router nào?** (React Router hay Next.js): tự check giùm t.
2. **Tên collections PocketBase chính xác** (đúng chữ hoa/thường): `ma_servers`, `ma_server_apps`, `ma__apps`, `ma_server_ports`, `ma_server_required_services`.
3. Trên `ma_servers` bạn hiện có field nào? (ít nhất `name`, `ip`, `netdata_url`, `docker_mode`, `env`, `is_active` là đủ).
4. “Dashboard” route mặc định là `/dashboard` hiển thị summary

---

## Gợi ý chốt về “server apps -> app ports”

Đúng: với requirement hiện tại, **nên show được mapping App → Ports** ngay trên Server Details page (ít nhất bằng expand row hoặc panel). Đây là phần đem lại giá trị inventory rõ nhất.

Nếu bạn muốn, tôi có thể viết tiếp một prompt “Cursor-ready” để implement **expandable rows** cho HeroUI table (AppsTable) theo đúng component API của HeroUI bạn đang dùng, để Cursor khỏi loay hoay với UI behavior.
----
Promt version 2:
Dưới đây là **prompt copy/paste** để Cursor implement **expandable rows** cho HeroUI Table ở tab **Apps**, và khi expand sẽ hiển thị **ports thuộc app đó** (map từ `server_ports.app_link` → `server_apps.id`). Prompt này giả định bạn đã có data fetch (server_apps + server_ports) ở Server Details page.

---

## Prompt — Implement Expandable Rows (AppsTable -> show Ports panel)

> Implement expandable rows cho bảng Apps (HeroUI Table) trong Server Details page.
>
> **Mục tiêu UI**
>
> * Tab `Apps`: hiển thị HeroUI Table list apps đang chạy trên server.
> * Mỗi row có icon button “expand/collapse” ở cột đầu (chevron).
> * Khi user click expand:
>
>   * mở 1 “detail row” ngay bên dưới row đó (full width)
>   * trong detail row hiển thị:
>
>     * danh sách ports thuộc app đó (table nhỏ hoặc list)
>     * nếu app không có port: hiển thị `No ports assigned`
> * Chỉ cho phép **một row expand tại một thời điểm** (click row khác thì collapse row cũ).
>
> **Data contract**
>
> * `serverApps`: list records từ collection `server_apps`, có `id`, `runtime`, `notes`, và `expand.app` chứa `{ name, owner }`.
> * `serverPorts`: list records từ `server_ports`, có `port`, `notes`, và `app_link` (relation → server_apps record id). Có thể có record không có `app_link` (unassigned).
> * Dựng `portsByServerAppId: Record<string, PortRecord[]>` bằng cách group `serverPorts` theo `app_link`.
>
> **Implementation requirements**
>
> 1. Tạo component `AppsTable.tsx` nhận props:
>
>    * `serverApps`
>    * `serverPorts`
> 2. Trong `AppsTable`, tạo state:
>
>    * `expandedId: string | null`
> 3. Build map:
>
>    * `const portsByApp = useMemo(() => groupBy(serverPorts, p => p.app_link ?? "__unassigned__"), [serverPorts]);`
>    * Khi render detail row, dùng `portsByApp[serverApp.id] ?? []`
> 4. HeroUI Table rendering:
>
>    * Cột đầu tiên: button icon chevron (rotate khi expanded)
>    * Các cột còn lại: App Name, Owner, Runtime, Notes
> 5. Render expandable detail row:
>
>    * Ngay sau row chính, nếu `expandedId === row.id` thì render thêm 1 row (tr) với `colSpan` = số lượng columns
>    * Bên trong cell đó render một panel (Card/Box) chứa bảng ports (mini table):
>
>      * Columns: Port, Notes
>      * Sort port tăng dần
> 6. UX:
>
>    * Click vào icon chỉ toggle expand (không trigger navigate)
>    * Nếu click row khác => set expandedId row mới (auto collapse row cũ)
>    * Giữ spacing/padding gọn, dùng border top nhẹ để phân tách
> 7. Không dùng dữ liệu mock, không hardcode.
>
> **Output mong muốn**
>
> * Code chạy được, không lỗi TypeScript.
> * Expand/collapse mượt, không phá layout Mosaic.
> * Nếu HeroUI Table API không hỗ trợ `<tr>` custom trực tiếp, hãy chuyển sang render table body thủ công hoặc dùng workaround: render `TableRow` phụ ngay sau `TableRow` chính.
>
> **Gợi ý kỹ thuật**
>
> * Tạo helper `groupBy` nhỏ trong `src/utils/groupBy.ts` hoặc inline useMemo.
> * `expandedId` toggle: `setExpandedId(prev => (prev === id ? null : id))`
> * Nên tách component `AppPortsPanel` để code sạch.

---

### (Tuỳ chọn) Prompt bổ sung nếu Cursor vướng HeroUI Table API

Nếu Cursor báo HeroUI Table không cho render `tr` phụ, dùng prompt này:

> Nếu HeroUI Table không hỗ trợ chèn “detail row” dạng `<tr>` trực tiếp, hãy implement expandable theo cách “row-as-card”:
>
> * Giữ Table cho header, nhưng render body bằng danh sách `<div>` (stack) có style giống row.
> * Mỗi item gồm: row chính + panel ports collapse/expand (dùng conditional render).
> * Đảm bảo UI vẫn giống table: các cột canh theo grid CSS (grid-template-columns) để thẳng hàng.
> * Vẫn giữ sorting/search như cũ.

---

Server table prompt:
Prompt cho Cursor

Context
Tôi đang dùng HeroUI Table. Hiện bảng Servers đang render theo kiểu text thuần → UI xấu, rối, không nhất quán.
Tôi muốn refactor toàn bộ table sang Custom Cells giống demo “Custom Cells” trên heroui.com (avatar + subtitle + badge + action icons).

Goal (bắt buộc đạt)
Áp dụng custom cell rendering theo column.key, không dùng table mặc định.

Yêu cầu chi tiết

Cột SERVER

Render dạng 2 dòng:

Dòng 1: server.name (bold)

Dòng 2: server.ip (muted / secondary text)

Không dùng <br/> thuần, phải dùng layout (flex-col, gap-1)

Cột NETDATA

Render bằng HeroUI Chip / Badge

Mapping:

Enabled → green / success

Disabled → gray / default

Cột NOTES

Nếu null hoặc - → render text muted

Cột UPDATED

Hiển thị dạng relative time (ví dụ: “about 5 hours ago”)

Style text nhỏ, secondary

Cột ACTIONS

Render icon buttons giống demo HeroUI:

View (eye)

Edit (pencil)

Delete (trash, danger)

Icon-only buttons, hover state rõ ràng

Technical constraints

Dùng đúng pattern:

<TableBody>
  {(item) => (
    <TableRow key={item.id}>
      {(columnKey) => (
        <TableCell>
          {renderCell(item, columnKey)}
        </TableCell>
      )}
    </TableRow>
  )}
</TableBody>


Viết renderCell(server, columnKey) bằng switch / if

Không hardcode JSX trong column definition

Không thay đổi API data shape

Definition of Done

Table nhìn giống demo Custom Cells của HeroUI

Không còn layout text phẳng như hiện tại

Code clean, tách renderCell, dễ mở rộng sau này (expand rows, server detail)

Nếu thiếu component HeroUI nào (Chip, Avatar, Button…) thì import và dùng đúng chuẩn HeroUI, không fake UI.

Ghi chú quan trọng cho bạn

Prompt này ép Cursor làm đúng kiến trúc, không phải “làm cho đẹp hơn chút”.

Nếu Cursor vẫn làm sai → khả năng cao file đang bị JSX cũ / logic table cũ đè lên, lúc đó cần yêu cầu Cursor:

“remove legacy table cell rendering and refactor fully to HeroUI custom cell pattern”

Nếu bạn muốn, mình có thể:

Viết sẵn renderCell() hoàn chỉnh theo data của bạn

Hoặc viết prompt riêng cho expandable rows (Server → Apps → Ports) theo cùng style này