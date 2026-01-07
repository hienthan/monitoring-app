export interface MetricPoint {
  ts: number; // epoch ms
  value: number;
}

export interface ChartSeries {
  id: string;
  label: string;
  unit: string;
  points: MetricPoint[];
}

export interface Chart {
  id: string;
  serverId: string;
  chart: "cpu" | "ram" | "disk" | "net" | "db";
  series: ChartSeries[];
}

export interface Alert {
  id: string;
  serverId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  since: string;
  clearedAt?: string;
}
