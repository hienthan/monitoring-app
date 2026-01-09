import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { CircularProgress } from "@heroui/react";
import { NetdataMetrics } from "../../repositories/netdataMetricsRepo";

interface KpiCardProps {
  title: string;
  value: number;
  unit?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  decimalPlaces?: number; // Number of decimal places to display
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit = "%", color = "primary", decimalPlaces = 0 }) => {
  // Format value with specified decimal places
  const formattedValue = decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value.toString();
  
  // Force re-render by using value in key
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col items-start pb-3 pt-4 px-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</p>
      </CardHeader>
      <CardBody className="flex flex-row items-center justify-between gap-4 pt-4 px-4 pb-4">
        <CircularProgress
          key={`${title}-progress-${value}`}
          aria-label={`${title} usage`}
          value={value}
          color={color}
          size="lg"
          showValueLabel
          valueLabel={<span className="text-sm font-semibold">{formattedValue}{unit}</span>}
        />
        <div key={`${title}-value-${value}`} className="flex flex-col items-end">
          <span className="text-2xl font-bold text-slate-900">{formattedValue}{unit}</span>
          <span className="text-xs text-slate-500 mt-1">Usage</span>
        </div>
      </CardBody>
    </Card>
  );
};

interface IOMetricCardProps {
  title: string;
  readValue: number;
  writeValue: number;
  unit?: string;
}

const IOMetricCard: React.FC<IOMetricCardProps> = ({ title, readValue, writeValue, unit = "KB/s" }) => {
  return (
    <Card key={`${title}-${readValue}-${writeValue}`} className="border border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col items-start pb-3 pt-4 px-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</p>
      </CardHeader>
      <CardBody className="pt-4 px-4 pb-4">
        <div className="space-y-3">
          <div key={`read-${readValue}`} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Read</span>
            <span className="text-lg font-semibold text-slate-900">{readValue} {unit}</span>
          </div>
          <div key={`write-${writeValue}`} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Write</span>
            <span className="text-lg font-semibold text-slate-900">{writeValue} {unit}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

interface NetworkMetricCardProps {
  title: string;
  inboundValue: number;
  outboundValue: number;
  unit?: string;
}

const NetworkMetricCard: React.FC<NetworkMetricCardProps> = ({ title, inboundValue, outboundValue, unit = "KB/s" }) => {
  // Convert KB/s to MB/s for display if > 1000
  const formatValue = (val: number) => {
    if (val >= 1024) {
      return `${(val / 1024).toFixed(1)} MB/s`;
    }
    return `${val} ${unit}`;
  };

  return (
    <Card key={`${title}-${inboundValue}-${outboundValue}`} className="border border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col items-start pb-3 pt-4 px-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</p>
      </CardHeader>
      <CardBody className="pt-4 px-4 pb-4">
        <div className="space-y-3">
          <div key={`inbound-${inboundValue}`} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Inbound</span>
            <span className="text-lg font-semibold text-slate-900">{formatValue(inboundValue)}</span>
          </div>
          <div key={`outbound-${outboundValue}`} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Outbound</span>
            <span className="text-lg font-semibold text-slate-900">{formatValue(outboundValue)}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

interface ServerKpiCardsProps {
  metrics: NetdataMetrics | null;
  isLoading?: boolean;
}

export const ServerKpiCards: React.FC<ServerKpiCardsProps> = ({
  metrics,
  isLoading = false,
}) => {
  const getColor = (value: number): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    if (value >= 90) return "danger";
    if (value >= 70) return "warning";
    if (value >= 50) return "default";
    return "success";
  };

  // Use metrics if available, otherwise show 0
  // Extract values to ensure component re-renders when metrics change
  const cpu = metrics?.cpu ?? 0;
  const ram = metrics?.ram ?? 0;
  const diskRead = metrics?.diskRead ?? 0;
  const diskWrite = metrics?.diskWrite ?? 0;
  const networkInbound = metrics?.networkInbound ?? 0;
  const networkOutbound = metrics?.networkOutbound ?? 0;

  // Calculate disk usage percentage (average of read+write for display purposes)
  // In real scenario, you might want disk usage percentage from system.disk chart
  const diskUsage = Math.min(100, Math.round((diskRead + diskWrite) / 100));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
            </CardHeader>
            <CardBody className="pt-4 px-4 pb-4">
              <div className="h-16 bg-slate-200 rounded animate-pulse"></div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  // Use metrics as key to force re-render when metrics change
  const metricsKey = metrics ? `${metrics.cpu}-${metrics.ram}-${metrics.diskRead}-${metrics.networkInbound}` : 'no-metrics';

  return (
    <div key={metricsKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard key={`cpu-${cpu}`} title="CPU" value={cpu} color={getColor(cpu)} />
      <KpiCard key={`ram-${ram}`} title="RAM" value={ram} color={getColor(ram)} decimalPlaces={2} />
      <IOMetricCard key={`disk-${diskRead}-${diskWrite}`} title="Disk I/O" readValue={diskRead} writeValue={diskWrite} />
      <NetworkMetricCard key={`network-${networkInbound}-${networkOutbound}`} title="Network" inboundValue={networkInbound} outboundValue={networkOutbound} />
    </div>
  );
};
