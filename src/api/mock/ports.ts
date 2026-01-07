import { PortOccupancy } from "../types/server";

export const portsMock: PortOccupancy[] = [
  {
    id: "port-1",
    serverId: "srv-1",
    port: 80,
    protocol: "tcp",
    process: "nginx",
    owner: "team-web",
    exposure: "public",
  },
  {
    id: "port-2",
    serverId: "srv-1",
    port: 443,
    protocol: "tcp",
    process: "nginx",
    owner: "team-web",
    exposure: "public",
  },
  {
    id: "port-3",
    serverId: "srv-2",
    port: 3000,
    protocol: "tcp",
    process: "node-api",
    owner: "team-api",
    exposure: "private",
  },
  {
    id: "port-4",
    serverId: "srv-3",
    port: 5432,
    protocol: "tcp",
    process: "postgres",
    owner: "team-data",
    exposure: "private",
  },
];
