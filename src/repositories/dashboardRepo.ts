import { inventoryRepo } from "./inventoryRepo";
import { monitoringRepo } from "./monitoringRepo";
import { DatacenterCardVM, ServerDetailVM } from "../types/viewmodels";

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

    const [ports, containers, charts, alerts] = await Promise.all([
      inventoryRepo.getPortsByServer(serverId),
      inventoryRepo.getContainersByServer(serverId),
      monitoringRepo.getChartsByServer(serverId),
      monitoringRepo.getAlertsByServer(serverId),
    ]);

    return {
      server,
      ports,
      containers,
      charts,
      alerts,
    };
  },
};
