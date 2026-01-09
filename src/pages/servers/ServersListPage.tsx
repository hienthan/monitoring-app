import React, { useEffect, useState } from "react";
import { ServersTable } from "../../components/servers/ServersTable";
import { ServerRow } from "../../types/servers";
import { inventoryRepo } from "../../repositories/inventoryRepo";
import { monitoringRepo } from "../../repositories/monitoringRepo";
import { Server } from "../../types/inventory";
import { getCollectionUrl } from "../../lib/pb";

export const ServersListPage: React.FC = () => {
  const [rows, setRows] = useState<ServerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadServers = async () => {
    setIsLoading(true);
    try {
      const [servers, alerts, rawApiData] = await Promise.all([
        inventoryRepo.getServers(),
        monitoringRepo.getAlerts(),
        // Fetch raw API data to get docker_mode and os
        fetch(getCollectionUrl("ma_servers"))
          .then(res => res.ok ? res.json() : [])
          .then(data => Array.isArray(data) ? data : (data.items || data.records || []))
          .catch(() => []),
      ]);

      // Create a map of raw API data by id for quick lookup
      const rawDataMap = new Map(rawApiData.map((item: any) => [item.id, item]));

      // Map Server to ServerRow with metrics
      const serverRows: ServerRow[] = servers.map((server: Server) => {
        const serverAlerts = alerts.filter(
          (a) => a.serverId === server.id && !a.clearedAt
        );

        // Mock metrics for now (will be replaced with API data)
        const cpuUsage = Math.floor(30 + Math.random() * 40);
        const ramUsage = Math.floor(40 + Math.random() * 30);

        // Map environment: use env field from server, format for display
        const envMap: Record<string, string> = {
          prod: "Prod",
          staging: "Staging",
          dev: "Dev",
          lab: "Lab",
        };
        const environment = envMap[server.env] || server.env.charAt(0).toUpperCase() + server.env.slice(1);

        // Get raw API data for this server
        const rawData = rawDataMap.get(server.id);
        
        // Extract docker_mode from raw API data (array field)
        // Keep original values: "cli", "desktop", or both "cli, desktop"
        const dockerModes: string[] = [];
        if (rawData?.docker_mode) {
          if (Array.isArray(rawData.docker_mode)) {
            dockerModes.push(...rawData.docker_mode);
          }
        }

        // Extract OS from raw API data
        const os = rawData?.os || null;

        return {
          ...server,
          cpu: cpuUsage,
          ram: ramUsage,
          disk: Math.floor(50 + Math.random() * 30),
          updatedAt: server.lastSeen,
          region: server.env.toUpperCase(),
          notes: (server as any).notes || "", // Get notes from API if available
          environment,
          dockerModes: dockerModes.length > 0 ? dockerModes : undefined,
          os: os || undefined,
        };
      });

      setRows(serverRows);
    } catch (error) {
      console.error("Failed to load servers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Servers</h1>
      <ServersTable rows={rows} isLoading={isLoading} onRefresh={loadServers} />
    </div>
  );
};
