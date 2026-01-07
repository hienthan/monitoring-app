import { Alert } from "../types/metric";

export const alertsMock: Alert[] = [
  {
    id: "al-1",
    serverId: "srv-2",
    severity: "critical",
    title: "High CPU",
    message: "CPU over 85% for 5m",
    since: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: "al-2",
    serverId: "srv-2",
    severity: "warning",
    title: "Memory pressure",
    message: "RAM over 75%",
    since: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: "al-3",
    serverId: "srv-1",
    severity: "warning",
    title: "Disk usage",
    message: "/var at 75%",
    since: new Date(Date.now() - 40 * 60_000).toISOString(),
  },
];
