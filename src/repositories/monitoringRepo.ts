import { alertsMock } from "../api/mock/alerts";
import { chartsMock } from "../api/mock/metrics";
import { Alert, Chart } from "../types/monitoring";

const useMock = true;

export const monitoringRepo = {
  async getChartsByServer(serverId: string): Promise<Chart[]> {
    if (useMock) return chartsMock.filter((c) => c.serverId === serverId);
    return chartsMock;
  },
  async getAlerts(): Promise<Alert[]> {
    if (useMock) return alertsMock;
    return alertsMock;
  },
  async getAlertsByServer(serverId: string): Promise<Alert[]> {
    if (useMock) return alertsMock.filter((a) => a.serverId === serverId);
    return alertsMock;
  },
};
