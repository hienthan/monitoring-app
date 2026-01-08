export type Environment = "prod" | "staging" | "dev" | "lab";

export type ServerStatus = "up" | "down" | "degraded";

export interface Server {
  id: string;
  name: string;
  hostname: string;
  ip: string;
  env: Environment;
  tags: string[];
  owner: string;
  netdataUrl?: string;
  status: ServerStatus;
  lastSeen: string;
  notes?: string;
}

export interface PortOccupancy {
  id: string;
  serverId: string;
  port: number;
  protocol: "tcp" | "udp";
  process: string;
  containerId?: string;
  owner: string;
  exposure: "public" | "private";
  note?: string;
}

export interface Container {
  id: string;
  serverId: string;
  name: string;
  image: string;
  ports: Array<{ host: number; container: number; protocol: "tcp" | "udp" }>;
  owner: string;
  restartPolicy: "no" | "on-failure" | "always" | "unless-stopped";
}
