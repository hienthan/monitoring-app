import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Skeleton } from "@heroui/react";
import { dashboardRepo } from "../../repositories/dashboardRepo";
import { ServerDetailVM } from "../../types/serverDetail";
import { ServerHeader } from "../../components/servers/ServerHeader";
import { ServerKpiCards } from "../../components/servers/ServerKpiCards";
import { ServerOverview } from "../../components/servers/ServerOverview";
import { RequiredServicesCard } from "../../components/servers/RequiredServicesCard";
import { AppsTable } from "../../components/servers/AppsTable";
import { PortsTable } from "../../components/servers/PortsTable";

export const ServerDetailPage: React.FC = () => {
  const { id = "" } = useParams();
  const [detail, setDetail] = useState<ServerDetailVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadServerDetail = () => {
    if (!id) return;
    setIsLoading(true);
    dashboardRepo
      .getServerDetail(id)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadServerDetail();
  }, [id]);

  if (!id) return <p>Missing server id</p>;

  if (isLoading || !detail) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 w-full rounded" />
          <Skeleton className="h-64 w-full rounded lg:col-span-2" />
        </div>
      </div>
    );
  }

  const server = detail.server;

  // Mock metrics (will be replaced with API data)
  const cpuUsage = Math.floor(30 + Math.random() * 40);
  const ramUsage = Math.floor(40 + Math.random() * 30);
  const diskUsage = Math.floor(50 + Math.random() * 30);
  const networkUsage = Math.floor(10 + Math.random() * 20);

  return (
    <div className="space-y-6">
      {/* Tier 1: Header */}
      <ServerHeader
        server={server}
        onRefresh={loadServerDetail}
        onEdit={() => {
          // TODO: Implement edit action
          console.log("Edit server:", id);
        }}
      />

      {/* Tier 2: Summary strip - KPI Cards */}
      <ServerKpiCards
        cpu={cpuUsage}
        ram={ramUsage}
        disk={diskUsage}
        network={networkUsage}
      />

      {/* Tier 3: Main body - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (1/3) */}
        <div className="space-y-4">
          <ServerOverview server={server} />
          <RequiredServicesCard
            services={detail.services}
            isLoading={false}
          />
        </div>

        {/* Right column (2/3) */}
        <div className="lg:col-span-2">
          <Tabs aria-label="Server apps and ports" defaultSelectedKey="apps">
            <Tab key="apps" title="Apps">
              <div className="pt-4">
                <AppsTable
                  apps={detail.apps}
                  ports={detail.ports}
                  isLoading={false}
                />
              </div>
            </Tab>

            <Tab key="ports" title="Ports">
              <div className="pt-4">
                <PortsTable
                  ports={detail.ports}
                  isLoading={false}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
