import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout";
import { DashboardLayout } from "../pages/dashboard/DashboardLayout";
import { ServersListPage } from "../pages/servers/ServersListPage";
import { ServerDetailPage } from "../pages/ServerDetail";
import { PortsPage } from "../pages/Ports";
import { AlertsPage } from "../pages/Alerts";
import { AppsPage } from "../pages/dashboard/AppsPage";
import { RedirectServerDetail } from "../pages/RedirectServerDetail";

export const AppRoutes: React.FC = () => (
  <AppLayout>
    <Routes>
      {/* Redirect root to dashboard/servers */}
      <Route path="/" element={<Navigate to="/dashboard/servers" replace />} />
      
      {/* Dashboard nested routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="servers" element={<ServersListPage />} />
        <Route path="servers/:id" element={<ServerDetailPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="ports" element={<PortsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        {/* Redirect /dashboard to /dashboard/servers */}
        <Route index element={<Navigate to="/dashboard/servers" replace />} />
      </Route>
      
      {/* Legacy routes - redirect to dashboard */}
      <Route path="/servers" element={<Navigate to="/dashboard/servers" replace />} />
      <Route path="/servers/:id" element={<RedirectServerDetail />} />
      <Route path="/ports" element={<Navigate to="/dashboard/ports" replace />} />
      <Route path="/alerts" element={<Navigate to="/dashboard/alerts" replace />} />
      
      {/* Other pages */}
      <Route path="/ticket" element={<div className="space-y-4"><h1 className="text-2xl font-semibold">Ticket</h1><p className="text-default-500">Coming soon</p></div>} />
      <Route path="/backup-status" element={<div className="space-y-4"><h1 className="text-2xl font-semibold">Backup Status</h1><p className="text-default-500">Coming soon</p></div>} />
    </Routes>
  </AppLayout>
);
