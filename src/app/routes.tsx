import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout";
import { DatacenterPage } from "../pages/Datacenter";
import { ServerDetailPage } from "../pages/ServerDetail";
import { PortsPage } from "../pages/Ports";
import { AlertsPage } from "../pages/Alerts";

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<DatacenterPage />} />
        <Route path="/servers/:id" element={<ServerDetailPage />} />
        <Route path="/ports" element={<PortsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </AppLayout>
  </BrowserRouter>
);
