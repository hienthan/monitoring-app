import { Alert, Chart } from "./monitoring";
import { Container, PortOccupancy, Server } from "./inventory";

export interface DatacenterCardVM {
  server: Server;
  cpuUsage: number;
  ramUsage: number;
  alertsOpen: number;
}

export interface ServerDetailVM {
  server: Server;
  containers: Container[];
  ports: PortOccupancy[];
  charts: Chart[];
  alerts: Alert[];
}
