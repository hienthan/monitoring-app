import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { CircularProgress } from "@heroui/react";

interface KpiCardProps {
  title: string;
  value: number;
  unit?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit = "%", color = "primary" }) => {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col items-start pb-3 pt-4 px-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</p>
      </CardHeader>
      <CardBody className="flex flex-row items-center justify-between gap-4 pt-4 px-4 pb-4">
        <CircularProgress
          aria-label={`${title} usage`}
          value={value}
          color={color}
          size="lg"
          showValueLabel
          valueLabel={<span className="text-sm font-semibold">{value}{unit}</span>}
        />
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-slate-900">{value}{unit}</span>
          <span className="text-xs text-slate-500 mt-1">Usage</span>
        </div>
      </CardBody>
    </Card>
  );
};

interface ServerKpiCardsProps {
  cpu?: number;
  ram?: number;
  disk?: number;
  network?: number;
}

export const ServerKpiCards: React.FC<ServerKpiCardsProps> = ({
  cpu = 0,
  ram = 0,
  disk = 0,
  network = 0,
}) => {
  const getColor = (value: number): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    if (value >= 90) return "danger";
    if (value >= 70) return "warning";
    if (value >= 50) return "default";
    return "success";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="CPU" value={cpu} color={getColor(cpu)} />
      <KpiCard title="RAM" value={ram} color={getColor(ram)} />
      <KpiCard title="Disk" value={disk} color={getColor(disk)} />
      <KpiCard title="Network" value={network} unit="MB/s" color={getColor(network / 10)} />
    </div>
  );
};
