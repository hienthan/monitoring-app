import { inventoryRepo } from "./inventoryRepo";
import { monitoringRepo } from "./monitoringRepo";
import { DatacenterCardVM } from "../types/viewmodels";
import { ServerDetailVM, ServerApp, ServerPort, RequiredService } from "../types/serverDetail";
import { getCollectionUrl } from "../lib/pb";

const useMock = false;

// Map API response to ServerApp
function mapApiServerApp(apiApp: any): ServerApp {
  return {
    id: apiApp.id || "",
    serverId: apiApp.server || apiApp.server_id || apiApp.serverId || "",
    appId: apiApp.app || apiApp.app_id || "",
    app: apiApp.expand?.app ? {
      id: apiApp.expand.app.id || "",
      name: apiApp.expand.app.name || "",
      owner: apiApp.expand.app.owner || "",
    } : undefined,
    runtime: apiApp.runtime || "",
    notes: apiApp.notes || "",
  };
}

// Map API response to ServerPort
function mapApiServerPort(apiPort: any): ServerPort {
  return {
    id: apiPort.id || "",
    serverId: apiPort.server || apiPort.server_id || apiPort.serverId || "",
    port: apiPort.port || 0,
    protocol: (apiPort.protocol || "tcp") as "tcp" | "udp",
    app_link: apiPort.app_link || apiPort.appLink || "",
    app: apiPort.expand?.app_link ? mapApiServerApp(apiPort.expand.app_link) : undefined,
    notes: apiPort.notes || "",
  };
}

// Map API response to RequiredService
function mapApiRequiredService(apiService: any): RequiredService {
  return {
    id: apiService.id || "",
    serverId: apiService.server || apiService.server_id || apiService.serverId || "",
    name: apiService.name || "",
    status: apiService.status || "",
    notes: apiService.notes || "",
  };
}

export const dashboardRepo = {
  async getDatacenterCards(): Promise<DatacenterCardVM[]> {
    const [servers, alerts] = await Promise.all([
      inventoryRepo.getServers(),
      monitoringRepo.getAlerts(),
    ]);

    return servers.map((s) => {
      const serverAlerts = alerts.filter((a) => a.serverId === s.id && !a.clearedAt);
      return {
        server: s,
        cpuUsage: Math.floor(30 + Math.random() * 40),
        ramUsage: Math.floor(40 + Math.random() * 30),
        alertsOpen: serverAlerts.length,
      };
    });
  },

  async getServerDetail(serverId: string): Promise<ServerDetailVM | null> {
    const server = await inventoryRepo.getServer(serverId);
    if (!server) return null;

    if (useMock) {
      // Mock data fallback
      const [ports, charts, alerts] = await Promise.all([
        inventoryRepo.getPortsByServer(serverId),
        monitoringRepo.getChartsByServer(serverId),
        monitoringRepo.getAlertsByServer(serverId),
      ]);

      return {
        server,
        apps: [],
        ports: ports.map(p => ({
          id: p.id,
          serverId: p.serverId,
          port: p.port,
          protocol: p.protocol,
          notes: p.note,
        })),
        services: [],
        charts,
        alerts,
      };
    }

    try {
      // Check if serverId is valid before making API calls
      if (!serverId || serverId === 'null' || serverId === 'undefined') {
        console.warn("Invalid serverId, skipping API calls");
        return {
          server,
          apps: [],
          ports: [],
          services: [],
          charts: [],
          alerts: [],
        };
      }

      // Fetch all data in parallel with expand relations
      // Use correct field name 'server' (not 'server_id')
      const [serverAppsRes, serverPortsRes, servicesRes, charts, alerts] = await Promise.all([
        fetch(`${getCollectionUrl("ma_server_apps")}?filter=(server='${serverId}')&expand=app`).catch(() => null),
        fetch(`${getCollectionUrl("ma_server_ports")}?filter=(server='${serverId}')&expand=app_link,app_link.app`).catch(() => null),
        fetch(`${getCollectionUrl("ma_server_required_services")}?filter=(server='${serverId}')`).catch(() => null),
        monitoringRepo.getChartsByServer(serverId),
        monitoringRepo.getAlertsByServer(serverId),
      ]);

      const apps: ServerApp[] = serverAppsRes?.ok 
        ? (await serverAppsRes.json()).items?.map(mapApiServerApp) || []
        : [];

      const ports: ServerPort[] = serverPortsRes?.ok
        ? (await serverPortsRes.json()).items?.map(mapApiServerPort) || []
        : [];

      const services: RequiredService[] = servicesRes?.ok
        ? (await servicesRes.json()).items?.map(mapApiRequiredService) || []
        : [];

      return {
        server,
        apps,
        ports,
        services,
        charts,
        alerts,
      };
    } catch (error) {
      console.error("Failed to fetch server detail:", error);
      // Fallback to basic data
      const [ports, charts, alerts] = await Promise.all([
        inventoryRepo.getPortsByServer(serverId),
        monitoringRepo.getChartsByServer(serverId),
        monitoringRepo.getAlertsByServer(serverId),
      ]);

      return {
        server,
        apps: [],
        ports: ports.map(p => ({
          id: p.id,
          serverId: p.serverId,
          port: p.port,
          protocol: p.protocol,
          notes: p.note,
        })),
        services: [],
        charts,
        alerts,
      };
    }
  },
};
