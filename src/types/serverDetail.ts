import { Server, PortOccupancy } from "./inventory";
import { Alert, Chart } from "./monitoring";

export interface ServerApp {
  id: string;
  serverId: string;
  appId?: string;
  app?: {
    id: string;
    name: string;
    owner?: string;
  };
  runtime?: string;
  notes?: string;
}

export interface ServerPort {
  id: string;
  serverId: string;
  port: number;
  protocol: "tcp" | "udp";
  app_link?: string; // Relation to server_apps.id
  app?: ServerApp;
  notes?: string;
}

export interface RequiredService {
  id: string;
  serverId: string;
  name: string;
  status?: string;
  notes?: string;
}

export interface ServerDetailVM {
  server: Server;
  apps: ServerApp[];
  ports: ServerPort[];
  services: RequiredService[];
  charts: Chart[];
  alerts: Alert[];
}
