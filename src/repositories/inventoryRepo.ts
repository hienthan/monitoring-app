import { serversMock } from "../api/mock/servers";
import { portsMock } from "../api/mock/ports";
import { containersMock } from "../api/mock/containers";
import { Container, PortOccupancy, Server } from "../types/inventory";

const useMock = true;

export const inventoryRepo = {
  async getServers(): Promise<Server[]> {
    if (useMock) return serversMock;
    // Swap to PocketBase here when ready.
    return serversMock;
  },
  async getServer(id: string): Promise<Server | undefined> {
    const list = await this.getServers();
    return list.find((s) => s.id === id);
  },
  async getPortsByServer(serverId: string): Promise<PortOccupancy[]> {
    if (useMock) return portsMock.filter((p) => p.serverId === serverId);
    return portsMock;
  },
  async getAllPorts(): Promise<PortOccupancy[]> {
    if (useMock) return portsMock;
    return portsMock;
  },
  async getContainersByServer(serverId: string): Promise<Container[]> {
    if (useMock) return containersMock.filter((c) => c.serverId === serverId);
    return containersMock;
  },
};
