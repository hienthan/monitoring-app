import { serversMock } from "../api/mock/servers";
import { portsMock } from "../api/mock/ports";
import { containersMock } from "../api/mock/containers";
import { Container, PortOccupancy, Server, ServerStatus, Environment } from "../types/inventory";
import { getCollectionUrl, getRecordUrl } from "../lib/pb";

const useMock = false; // Set to false to use API

// Map API response to Server type
function mapApiServerToServer(apiServer: any): Server {
  return {
    id: apiServer.id || apiServer["@id"] || "",
    name: apiServer.name || apiServer.hostname || "Unknown",
    hostname: apiServer.hostname || apiServer.name || "",
    ip: apiServer.ip || apiServer.ip_address || "",
    env: (apiServer.env || apiServer.environment || "prod") as Environment,
    tags: Array.isArray(apiServer.tags) ? apiServer.tags : (apiServer.tags ? [apiServer.tags] : []),
    owner: apiServer.owner || apiServer.owner_name || "unknown",
    netdataUrl: apiServer.netdata_url || apiServer.netdataUrl || apiServer.netdata_url,
    status: mapStatus(apiServer.status || apiServer.state),
    lastSeen: apiServer.lastSeen || apiServer.last_seen || apiServer.updated || new Date().toISOString(),
    notes: apiServer.notes || apiServer.note || "",
  };
}

function mapStatus(status: string): ServerStatus {
  const statusLower = (status || "").toLowerCase();
  if (statusLower === "up" || statusLower === "online" || statusLower === "active") return "up";
  if (statusLower === "degraded" || statusLower === "warning") return "degraded";
  return "down";
}

export const inventoryRepo = {
  async getServers(): Promise<Server[]> {
    if (useMock) return serversMock;
    
    try {
      const response = await fetch(getCollectionUrl("ma_servers"));
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle both array and object with items property
      const items = Array.isArray(data) ? data : (data.items || data.records || []);
      
      return items.map(mapApiServerToServer);
    } catch (error) {
      console.error("Failed to fetch servers from API:", error);
      // Fallback to mock data on error
      return serversMock;
    }
  },
  
  async getServer(id: string): Promise<Server | undefined> {
    if (useMock) {
      const list = await this.getServers();
      return list.find((s) => s.id === id);
    }
    
    try {
      const response = await fetch(getRecordUrl("ma_servers", id));
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return mapApiServerToServer(data);
    } catch (error) {
      console.error(`Failed to fetch server ${id} from API:`, error);
      // Fallback to getServers and find
      const list = await this.getServers();
      return list.find((s) => s.id === id);
    }
  },
  
  async getPortsByServer(serverId: string): Promise<PortOccupancy[]> {
    if (useMock) return portsMock.filter((p) => p.serverId === serverId);
    // TODO: Implement API call for ports
    return portsMock.filter((p) => p.serverId === serverId);
  },
  
  async getAllPorts(): Promise<PortOccupancy[]> {
    if (useMock) return portsMock;
    // TODO: Implement API call for ports
    return portsMock;
  },
  
  async getContainersByServer(serverId: string): Promise<Container[]> {
    if (useMock) return containersMock.filter((c) => c.serverId === serverId);
    // TODO: Implement API call for containers
    return containersMock.filter((c) => c.serverId === serverId);
  },
};
