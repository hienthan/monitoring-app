import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Dashboard Layout - Nested route layout for dashboard pages
 * This layout wraps all dashboard pages (servers, apps, ports, alerts)
 */
export const DashboardLayout: React.FC = () => {
  return <Outlet />;
};
