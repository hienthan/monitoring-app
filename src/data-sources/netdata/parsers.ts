import { Chart, ChartSeries, MetricPoint } from "../../types/monitoring";

// Minimal parser stub. Adapt to actual Netdata responses.
export const parseNetdataChart = (
  serverId: string,
  chartId: string,
  raw: any
): Chart => {
  const labels: string[] = raw?.labels || [];
  const data: number[][] = raw?.data || [];

  const points: MetricPoint[] = data.map((row) => ({
    ts: (row[0] as number) * 1000,
    value: row[1] as number,
  }));

  const series: ChartSeries[] = [
    {
      id: chartId,
      label: chartId,
      unit: raw?.units || "",
      points,
    },
  ];

  return {
    id: chartId,
    serverId,
    chart: "cpu",
    series,
  };
};
