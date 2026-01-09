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
import { useNetdataMetrics } from "../../hooks/useNetdataMetrics";

export const ServerDetailPage: React.FC = () => {
  const { id = "" } = useParams();
  const [detail, setDetail] = useState<ServerDetailVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Netdata metrics - must be called unconditionally
  // Build netdataUrl from server.netdataUrl / netdataBaseUrl or fallback to http://{ip}:19999
  const netdataUrl = React.useMemo(() => {
    const server = detail?.server;
    if (!server) return undefined;

    // Respect isNetdataEnabled flag from API (default true if missing)
    if (server.isNetdataEnabled === false) return undefined;

    if (server.netdataUrl) return server.netdataUrl;
    if (server.netdataBaseUrl) return server.netdataBaseUrl;

    // Fallback: build from IP if nothing else is configured
    if (server.ip) return `http://${server.ip}:19999`;

    return undefined;
  }, [detail?.server]);

  const { metrics, isLoading: metricsLoading, error: metricsError } = useNetdataMetrics(netdataUrl);
  
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

  return (
    <div className="space-y-8">
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
      <div className="pt-4">
        <ServerKpiCards
          metrics={metrics}
          isLoading={metricsLoading}
        />
      </div>

      {/* Tier 3: Main body - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
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
          <div className="space-y-2">
            <h3 className="text-lg font-semibold px-1">Apps & Ports</h3>
            <div className="overflow-hidden rounded border bg-white">
              <Tabs 
                aria-label="Server apps and ports" 
                defaultSelectedKey="apps"
                classNames={{
                  base: "w-full",
                  tabList: "border-b border-slate-200 bg-slate-50",
                  tab: "data-[selected=true]:bg-white data-[selected=true]:border-b-2 data-[selected=true]:border-b-slate-900 data-[selected=true]:font-semibold data-[selected=true]:text-slate-900",
                  tabContent: "group-data-[selected=true]:text-slate-900",
                  panel: "p-0",
                }}
              >
                <Tab key="apps" title="Apps">
                  <div className="p-0">
                    <AppsTable
                      apps={detail.apps}
                      ports={detail.ports}
                      isLoading={false}
                    />
                  </div>
                </Tab>

                <Tab key="ports" title="Ports">
                  <div className="p-0">
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
      </div>
    </div>
  );
};
